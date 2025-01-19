import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { TodoType } from "@/lib/types";

function TodoView({ todo }: { todo: TodoType }) {
  return (
    <div className="flex items-center rounded border p-4 shadow-sm transition-colors hover:bg-gray-50">
      <div>
        <p>{todo.name}</p>
      </div>
      <div className="ml-auto">
        <Button variant="outline">
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}

export default TodoView;
