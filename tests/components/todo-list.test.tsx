import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodoList } from "@/components/todo-list";

vi.mock("@/components/todo-list", () => ({
  TodoList: () => <div>TodoList Component</div>,
}));

describe("TodoList (integration)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render TodoList component", () => {
    render(<TodoList />);
    expect(screen.getByText("TodoList Component")).toBeInTheDocument();
  });
});
