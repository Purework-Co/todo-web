"use client";

import { useState, useEffect } from "react";
import { AddTodo } from "./add-todo";
import { TodoItem } from "./todo-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Todo {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
  createdAt: string;
  updatedAt: string;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const url =
        filter === "all" ? "/api/todos" : `/api/todos?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTodos(data);
      }
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleAdd = async (newTodo: { title: string; status: string }) => {
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      if (res.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const handleUpdate = async (id: string, status: string) => {
    if (!Array.isArray(todos)) return;
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setTodos(
          todos.map((todo) =>
            todo.id === id
              ? { ...todo, status: status as "todo" | "doing" | "done" }
              : todo,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!Array.isArray(todos)) return;
    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const todoCounts = {
    all: todos.length,
    todo: todos.filter((t) => t.status === "todo").length,
    doing: todos.filter((t) => t.status === "doing").length,
    done: todos.filter((t) => t.status === "done").length,
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Todos</h1>

      <div className="mb-6">
        <AddTodo onAdd={handleAdd} />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Select
          value={filter}
          onValueChange={(value) => value && setFilter(value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({todoCounts.all})</SelectItem>
            <SelectItem value="todo">To Do ({todoCounts.todo})</SelectItem>
            <SelectItem value="doing">Doing ({todoCounts.doing})</SelectItem>
            <SelectItem value="done">Done ({todoCounts.done})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No todos yet. Add one above!
        </p>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoList;
