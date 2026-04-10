import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId: session.user.id,
        ...(status && { status: status as 'todo' | 'doing' | 'done' }),
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(todos)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, status = 'todo' } = await req.json()

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        status: status as 'todo' | 'doing' | 'done',
        userId: session.user.id,
      },
    })

    return NextResponse.json(todo, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
  }
}