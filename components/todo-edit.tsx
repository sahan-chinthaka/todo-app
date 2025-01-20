import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth";
import { TodoType } from "@/lib/types";
import { api } from "@/lib/utils";
import { Edit } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";

export function EditTodo({
  todo,
  setTodos,
}: {
  todo: TodoType;
  setTodos: Dispatch<SetStateAction<TodoType[] | undefined>>;
}) {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState(false);
  const auth = useAuth();
  const [open, setOpen] = useState(false);

  function saveButton() {
    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;
    const date = dateRef.current?.valueAsDate;

    if (title === "" || title === undefined) {
      return;
    }

    setDisabled(true);
    api
      .put(`/api/todo/${todo._id}`, {
        name: title,
        description,
        date: date ?? undefined,
        userId: "",
      })
      .then(() => {
        setTimeout(() => {
          setTodos((todos) =>
            todos?.map((t) => {
              if (t._id === todo._id) {
                return {
                  ...t,
                  name: title as string,
                  description: description as string,
                  date: date as Date,
                  userId: auth?.uid ?? "",
                };
              }
              return t;
            }),
          );
        }, 200);
        setOpen(false);
      })
      .finally(() => setDisabled(false));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Edit size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>
            Make changes to your todo here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              autoComplete="off"
              id="title"
              placeholder="What is your next task?"
              className="col-span-3"
              ref={titleRef}
              name="title"
              defaultValue={todo.name}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              autoComplete="off"
              placeholder="Describe the task - optional"
              className="col-span-3 max-h-[150px]"
              name="description"
              id="description"
              ref={descriptionRef}
              defaultValue={todo.description}
            ></Textarea>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Due Date
            </Label>
            <Input
              ref={dateRef}
              id="title"
              type="date"
              className="col-span-3"
              name="title"
              defaultValue={todo.date?.toISOString().split("T")[0]}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={saveButton} disabled={disabled}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
