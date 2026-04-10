import { describe, it, expect, vi, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'

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

vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockResolvedValue('hashed_password'),
}))

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

const { prisma } = await import('@/lib/prisma')

describe('POST /api/auth/register', async () => {
  const { POST } = await import('@/app/api/auth/register/route')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 400 if email is missing', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ password: 'password123' }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('Email and password are required')
  })

  it('should return 400 if password is missing', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('Email and password are required')
  })

  it('should return 400 if user already exists', async () => {
    ;(prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: 'existing-user-id',
      email: 'test@example.com',
    })

    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('User already exists')
  })

  it('should return 201 and create user on valid registration', async () => {
    ;(prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null)
    ;(prisma.user.create as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: 'new-user-id',
      email: 'test@example.com',
    })

    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'password123', name: 'Test User' }),
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.message).toBe('User created successfully')
    expect(data.user).toEqual({ id: 'new-user-id', email: 'test@example.com' })
    expect(hash).toHaveBeenCalledWith('password123', 10)
  })
})