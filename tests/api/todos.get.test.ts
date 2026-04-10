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

describe('GET /api/todos', async () => {
  const { GET } = await import('@/app/api/todos/route')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 401 if not authenticated', async () => {
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null)

    const req = new Request('http://localhost/api/todos')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return todos for authenticated user', async () => {
    const mockTodos = [
      { id: '1', title: 'Test 1', status: 'todo', userId: 'user-1' },
      { id: '2', title: 'Test 2', status: 'done', userId: 'user-1' },
    ]
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      user: { id: 'user-1' },
    })
    ;(prisma.todo.findMany as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockTodos)

    const req = new Request('http://localhost/api/todos')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual(mockTodos)
  })

  it('should filter todos by status', async () => {
    const mockTodos = [
      { id: '1', title: 'Test 1', status: 'todo', userId: 'user-1' },
    ]
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      user: { id: 'user-1' },
    })
    ;(prisma.todo.findMany as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockTodos)

    const req = new Request('http://localhost/api/todos?status=todo')
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(prisma.todo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'todo',
        }),
      })
    )
  })
})