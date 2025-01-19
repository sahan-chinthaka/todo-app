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

export default function Home() {
  const auth = useAuth();
  const [todos, setTodos] = useState<TodoType[]>();
  const [active, setActive] = useState<Filter>(Filter.All);

  useEffect(() => {
    if (!auth) return;
    api.get("/api/todo").then((res) => {
      if (res.data.done) {
        setTodos(res.data.todos);
        console.log(res.data.todos);
      }
    });
  }, [auth]);

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
      <div className="mt-10 space-y-2">
        {todos && todos.map((todo, k) => <TodoView key={k} todo={todo} />)}
      </div>
    </div>
  );
}
