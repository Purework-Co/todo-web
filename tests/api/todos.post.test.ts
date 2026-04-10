import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    todo: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

const { prisma } = await import('@/lib/prisma')
const { auth } = await import('@/lib/auth')

describe('POST /api/todos', async () => {
  const { POST } = await import('@/app/api/todos/route')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 401 if not authenticated', async () => {
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null)

    const req = new Request('http://localhost/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title: 'New Todo' }),
    })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return 400 if title is missing', async () => {
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      user: { id: 'user-1' },
    })

    const req = new Request('http://localhost/api/todos', {
      method: 'POST',
      body: JSON.stringify({ status: 'todo' }),
    })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('Title is required')
  })

  it('should create todo with valid data', async () => {
    const mockTodo = { id: 'new-todo-id', title: 'New Todo', status: 'todo', userId: 'user-1' }
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      user: { id: 'user-1' },
    })
    ;(prisma.todo.create as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockTodo)

    const req = new Request('http://localhost/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title: 'New Todo', status: 'todo' }),
    })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data).toEqual(mockTodo)
    expect(prisma.todo.create).toHaveBeenCalledWith({
      data: {
        title: 'New Todo',
        status: 'todo',
        userId: 'user-1',
      },
    })
  })
})