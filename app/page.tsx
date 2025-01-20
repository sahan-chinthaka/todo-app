"use client";

import AddTodo from "@/components/add-todo";
import TodoView from "@/components/todo-view";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [filteredTodos, setFilteredTodos] = useState<TodoType[]>();
  const [datedTodos, setDatedTodos] = useState<IDatedTodo[]>();

  useEffect(() => {
    if (!todos) return;
    if (filter === Filter.All) {
      setFilteredTodos(todos);
    } else if (filter === Filter.Today) {
      setFilteredTodos(
        todos.filter((todo) => {
          if (!todo.date) return false;
          const today = new Date();
          return (
            todo.date.getDate() === today.getDate() &&
            todo.date.getMonth() === today.getMonth() &&
            todo.date.getFullYear() === today.getFullYear()
          );
        }),
      );
    } else if (filter === Filter.Tommorow) {
      setFilteredTodos(
        todos.filter((todo) => {
          if (!todo.date) return false;
          const today = new Date();
          const tommorow = new Date();
          tommorow.setDate(today.getDate() + 1);
          return (
            todo.date.getDate() === tommorow.getDate() &&
            todo.date.getMonth() === tommorow.getMonth() &&
            todo.date.getFullYear() === tommorow.getFullYear()
          );
        }),
      );
    }
  }, [todos, filter]);

  function updateTodos() {
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
  }

  useEffect(() => {
    if (auth === undefined) return;
    if (auth === null) {
      setTodos([]);
    }

    updateTodos();
  }, [auth]);

  useEffect(() => {
    if (!filteredTodos) return;
    const todosWithNoDate: TodoType[] = [];
    const tempDatedTodos: IDatedTodo[] = [];

    for (const todo of filteredTodos) {
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

    if (todosWithNoDate.length != 0)
      setDatedTodos([{ todos: todosWithNoDate }, ...tempDatedTodos]);
    else setDatedTodos(tempDatedTodos);
  }, [filteredTodos]);

  return (
    <div className="container mx-auto">
      <AddTodo update={updateTodos} />
      <div className="mt-10 flex justify-center gap-2 sm:justify-start">
        <span
          onClick={() => setFilter(Filter.All)}
          className={cn(
            "block cursor-pointer border-b-2 border-b-primary/10 px-4 py-2",
            filter == "all" && "rounded-t border-b-primary bg-primary/5",
          )}
        >
          All
        </span>
        <span
          onClick={() => setFilter(Filter.Today)}
          className={cn(
            "block cursor-pointer border-b-2 border-b-primary/10 px-4 py-2",
            filter == "today" && "rounded-t border-b-primary bg-primary/5",
          )}
        >
          Today
        </span>
        <span
          onClick={() => setFilter(Filter.Tommorow)}
          className={cn(
            "block cursor-pointer border-b-2 border-b-primary/10 px-4 py-2",
            filter == "tommorow" && "rounded-t border-b-primary bg-primary/5",
          )}
        >
          Tommorow
        </span>
      </div>
      <div className="mt-10">
        {datedTodos &&
          datedTodos.length != 0 &&
          datedTodos.map((datedTodo, k) => (
            <div key={k}>
              {datedTodo.date && (
                <p className="mb-2 mt-10 text-gray-400">
                  {datedTodo.date.toDateString()}
                </p>
              )}
              <div className="space-y-2">
                {datedTodo.todos.map((todo) => (
                  <TodoView
                    todo={todo}
                    key={todo._id}
                    todos={todos}
                    setTodos={setTodos}
                  />
                ))}
              </div>
            </div>
          ))}
        {datedTodos && datedTodos.length == 0 && (
          <div className="my-10">
            <img
              src="/not-found.webp"
              alt="Not found image"
              className="mx-auto block max-w-[400px]"
            />
            <p className="mt-4 text-center text-gray-400">
              No todos found! <br /> Add some todos to get started.
            </p>
          </div>
        )}
        {!datedTodos && (
          <div>
            <Skeleton className="my-4 h-[50px]" />
            <Skeleton className="my-4 h-[50px]" />
            <Skeleton className="my-4 h-[20px] w-36 rounded-none" />
            <Skeleton className="my-4 h-[50px]" />
            <Skeleton className="my-4 h-[50px]" />
          </div>
        )}
      </div>
    </div>
  );
}
