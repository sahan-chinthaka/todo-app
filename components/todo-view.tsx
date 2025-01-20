import { useToast } from "@/hooks/use-toast";
import { TodoType } from "@/lib/types";
import { api } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ToastAction } from "./ui/toast";
import { useAuth } from "@/context/auth";

function TodoView({
  todo,
  todos,
  setTodos,
}: {
  todo: TodoType;
  setTodos: Dispatch<SetStateAction<TodoType[] | undefined>>;
  todos?: TodoType[];
}) {
  const { toast } = useToast();
  const duration = 5000;
  const tempTodos = useRef<TodoType[] | undefined>(undefined);
  const auth = useAuth();

  function deleteTodo() {
    tempTodos.current = todos ? [...todos] : undefined;
    setTodos((todos) => todos?.filter((t) => t._id !== todo._id));

    let t: any = undefined;

    const deleteTimeOut = setTimeout(() => {
      if (auth === null) return;
      api.delete(`/api/todo/${todo._id}`).then(() => {
        if (t) t.dismiss();
      });
    }, duration);

    t = toast({
      title: "Todo deleted",
      duration: duration,
      description: "The todo has been removed successfully.",
      action: (
        <ToastAction
          altText="Undo"
          onClick={() => {
            clearTimeout(deleteTimeOut);
            setTodos(tempTodos.current);
          }}
        >
          Undo
        </ToastAction>
      ),
    });
  }

  return (
    <div className="group rounded border shadow-sm">
      <div className="flex items-center border-b px-4 py-2 transition-colors group-hover:bg-gray-50">
        <div>
          <p>{todo.name}</p>
        </div>
        <div className="ml-auto">
          <Button variant="outline" onClick={deleteTodo}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      {todo.description && (
        <pre className="px-4 py-2 font-[inherit] text-sm text-gray-500">
          {todo.description}
        </pre>
      )}
    </div>
  );
}

export default TodoView;
