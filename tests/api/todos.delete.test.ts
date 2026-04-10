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

describe('DELETE /api/todos/[id]', async () => {
  const { DELETE } = await import('@/app/api/todos/[id]/route')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 401 if not authenticated', async () => {
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null)

    const req = new Request('http://localhost/api/todos/123', { method: 'DELETE' })
    const res = await DELETE(req, { params: Promise.resolve({ id: '123' }) })
    const data = await res.json()

    expect(res.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return 404 if todo not found', async () => {
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ user: { id: 'user-1' } })
    ;(prisma.todo.findFirst as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null)

    const req = new Request('http://localhost/api/todos/123', { method: 'DELETE' })
    const res = await DELETE(req, { params: Promise.resolve({ id: '123' }) })
    const data = await res.json()

    expect(res.status).toBe(404)
    expect(data.error).toBe('Todo not found')
  })

  it('should delete todo with valid data', async () => {
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ user: { id: 'user-1' } })
    ;(prisma.todo.findFirst as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ id: '123', userId: 'user-1' })
    ;(prisma.todo.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ id: '123' })

    const req = new Request('http://localhost/api/todos/123', { method: 'DELETE' })
    const res = await DELETE(req, { params: Promise.resolve({ id: '123' }) })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.message).toBe('Todo deleted successfully')
  })
})