'use client'

import { signOut } from 'next-auth/react'
import TodoList from '@/components/todo-list'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <h1 className="text-xl font-semibold">Todo App</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          >
            Logout
          </Button>
        </div>
      </header>
      <main>
        <TodoList />
      </main>
    </div>
  )
}