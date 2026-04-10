import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodoItem } from '@/components/todo-item'

const mockTodo = {
  id: '123',
  title: 'Test Todo',
  status: 'todo' as const,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
}

describe('TodoItem', () => {
  it('should render todo title', () => {
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    render(<TodoItem todo={mockTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />)

    expect(screen.getByText('Test Todo')).toBeInTheDocument()
  })

  it('should have delete button', () => {
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    render(<TodoItem todo={mockTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should apply strikethrough when status is done', () => {
    const doneTodo = { ...mockTodo, status: 'done' as const }
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    render(<TodoItem todo={doneTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />)

    const title = screen.getByText('Test Todo')
    expect(title).toHaveClass('line-through')
  })
})