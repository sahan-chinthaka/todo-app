"use client";

import AddTodo from "@/components/add-todo";
import TodoView from "@/components/todo-view";
import { useAuth } from "@/context/auth";
import { TodoType } from "@/lib/types";
import { api, cn } from "@/lib/utils";
import { useEffect, useState } from "react";

enum Filter {
  All = "all",
  Today = "today",
  Tommorow = "tommorow",
}

interface IDatedTodo {
  date?: Date;
  todos: TodoType[];
}

export default function Home() {
  const auth = useAuth();
  const [todos, setTodos] = useState<TodoType[]>();
  const [active, setActive] = useState<Filter>(Filter.All);
  const [datedTodos, setDatedTodos] = useState<IDatedTodo[]>();

  useEffect(() => {
    if (!auth) return;
    api.get("/api/todo").then((res) => {
      if (res.data.done) {
        setTodos(
          res.data.todos.map((todo: any) => ({
            ...todo,
            date: todo.date ? new Date(todo.date) : null,
          })),
        );
      }
    });
  }, [auth]);

  useEffect(() => {
    if (!todos) return;
    const todosWithNoDate: TodoType[] = [];
    const tempDatedTodos: IDatedTodo[] = [];

    for (const todo of todos) {
      if (!todo.date) {
        todosWithNoDate.push(todo);
      } else {
        let found = false;

        for (const datedTodo of tempDatedTodos) {
          if (
            datedTodo.date?.toLocaleDateString() ===
            todo.date?.toLocaleDateString()
          ) {
            datedTodo.todos.push(todo);
            found = true;
            continue;
          }
        }
        if (!found) {
          tempDatedTodos.push({ date: todo.date, todos: [todo] });
        }
      }
    }

    setDatedTodos([{ todos: todosWithNoDate }, ...tempDatedTodos]);
  }, [todos]);

  return (
    <div className="container mx-auto">
      <AddTodo />
      <div className="mt-10 flex space-x-2">
        <span
          onClick={() => setActive(Filter.All)}
          className={cn(
            "block cursor-pointer border-b-2 border-b-primary/10 px-4 py-2",
            active == "all" && "rounded-t border-b-primary bg-primary/5",
          )}
        >
          All
        </span>
        <span
          onClick={() => setActive(Filter.Today)}
          className={cn(
            "block cursor-pointer border-b-2 border-b-primary/10 px-4 py-2",
            active == "today" && "rounded-t border-b-primary bg-primary/5",
          )}
        >
          Today
        </span>
        <span
          onClick={() => setActive(Filter.Tommorow)}
          className={cn(
            "block cursor-pointer border-b-2 border-b-primary/10 px-4 py-2",
            active == "tommorow" && "rounded-t border-b-primary bg-primary/5",
          )}
        >
          Tommorow
        </span>
      </div>
      <div className="mt-10">
        {datedTodos &&
          datedTodos.map((datedTodo, k) => (
            <div key={k}>
              {datedTodo.date && (
                <p className="mb-2 mt-10 text-gray-400">
                  {datedTodo.date.toDateString()}
                </p>
              )}
              <div className="space-y-2">
                {datedTodo.todos.map((todo) => (
                  <TodoView todo={todo} key={todo._id} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
