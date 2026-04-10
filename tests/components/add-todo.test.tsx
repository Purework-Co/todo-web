import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AddTodo } from '@/components/add-todo'

describe('AddTodo', () => {
  it('should render input and add button', () => {
    const mockOnAdd = vi.fn()
    render(<AddTodo onAdd={mockOnAdd} />)

    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument()
    expect(screen.getByText('Add')).toBeInTheDocument()
  })

  it('should have initial status todo', () => {
    const mockOnAdd = vi.fn()
    const { container } = render(<AddTodo onAdd={mockOnAdd} />)
    
    const selectTrigger = container.querySelector('[role="combobox"]')
    expect(selectTrigger).toBeInTheDocument()
  })
})