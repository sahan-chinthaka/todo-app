import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";
import { TodoType } from "@/lib/types";
import { api, cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

function AddTodo({
  update,
  setTodos,
}: {
  update: () => void;
  todos?: TodoType[];
  setTodos: Dispatch<SetStateAction<TodoType[] | undefined>>;
}) {
  const [date, setDate] = useState<Date>();
  const resetButton = useRef<HTMLButtonElement>(null);
  const [disabled, setDisabled] = useState(true);
  const [dateOption, setDateOption] = useState<
    "today" | "tomorrow" | "next-week" | "date" | ""
  >("");
  const auth = useAuth();
  const offlineCounter = useRef(0);
  const { toast } = useToast();

  useEffect(() => {
    if (auth !== undefined) {
      setDisabled(false);
    }
  }, [auth]);

  function submit(e: any) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name");

    if (!name || name === "") {
      return;
    }

    const description = formData.get("description");

    let d = date;
    if (dateOption === "today") {
      d = new Date();
    } else if (dateOption === "tomorrow") {
      d = new Date();
      d.setDate(d.getDate() + 1);
    } else if (dateOption === "next-week") {
      d = new Date();
      d.setDate(d.getDate() + 7);
    } else if (dateOption === null) {
      d = undefined;
    }

    if (auth === null) {
      setTodos((prev) => [
        ...prev!,
        {
          _id: `offline-${offlineCounter.current++}`,
          name: name as string,
          description: description as string,
          date: d,
          userId: "offline",
        },
      ]);
      toast({
        title: "Todo added successfully",
      });

      if (resetButton.current) {
        resetButton.current.click();
      }
      return;
    }

    setDisabled(true);
    api
      .post("/api/todo", {
        userId: "id",
        name,
        description,
        date: d,
      })
      .then((res) => {
        if (res.data.done) {
          toast({ title: "Todo added successfully" });
          update();
          if (resetButton.current) {
            resetButton.current.click();
          }
        } else {
          toast(res.data.message);
        }
      })
      .catch((e) => {
        toast(e.message);
      })
      .finally(() => {
        setDisabled(false);
      });
  }

  return (
    <form onSubmit={submit}>
      <div className="flex flex-col gap-2 rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-2 font-semibold">New Todo</div>
        <Input
          placeholder="What is your next task?"
          name="name"
          autoComplete="off"
        />
        <Textarea
          placeholder="Describe the task - optional"
          className="max-h-[150px]"
          name="description"
          autoComplete="off"
        ></Textarea>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row">
          <Select
            name="date"
            onValueChange={(value: any) =>
              setDateOption(value == "remove" ? "" : value)
            }
            defaultValue={dateOption}
            value={dateOption}
          >
            <SelectTrigger className="w-auto sm:w-[120px]">
              <SelectValue placeholder="Due Date" />
            </SelectTrigger>
            <SelectContent className="w-auto">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="next-week">Next week</SelectItem>
              <SelectItem value="date">Pick a date</SelectItem>
              {dateOption && (
                <SelectItem
                  value="remove"
                  className="flex w-full cursor-pointer items-center justify-center p-2 text-destructive"
                >
                  Remove Due Date
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {dateOption === "date" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-auto justify-start text-left font-normal sm:w-[240px]",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon />
                  {date ? date.toDateString() : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              ref={resetButton}
              type="reset"
              onClick={() => {
                setDate(undefined);
                setDateOption("");
              }}
            >
              Clear
            </Button>
            <Button disabled={disabled} type="submit">
              Add
            </Button>
          </div>
        </div>
        {auth === null && (
          <p className="p-4 text-center text-gray-400">
            Sign in to sync and manage your todos across devices
          </p>
        )}
      </div>
    </form>
  );
}

export default AddTodo;
