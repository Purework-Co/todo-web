'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Todo {
  id: string
  title: string
  status: 'todo' | 'doing' | 'done'
  createdAt: string
  updatedAt: string
}

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: string, status: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const statusColors = {
    todo: 'bg-gray-100',
    doing: 'bg-yellow-100',
    done: 'bg-green-100',
  }

  const statusLabels = {
    todo: 'To Do',
    doing: 'Doing',
    done: 'Done',
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${statusColors[todo.status]}`}>
      <Checkbox
        checked={todo.status === 'done'}
        onCheckedChange={() => {
          const nextStatus = todo.status === 'done' ? 'todo' : 'done'
          onUpdate(todo.id, nextStatus)
        }}
      />
      <span className={`flex-1 ${todo.status === 'done' ? 'line-through text-gray-500' : ''}`}>
        {todo.title}
      </span>
      <Select
        value={todo.status}
        onValueChange={(value) => value && onUpdate(todo.id, value)}
      >
        <SelectTrigger className="w-[100px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todo">{statusLabels.todo}</SelectItem>
          <SelectItem value="doing">{statusLabels.doing}</SelectItem>
          <SelectItem value="done">{statusLabels.done}</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
      </Button>
    </div>
  )
}