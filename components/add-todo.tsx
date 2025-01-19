import { api, cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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

function AddTodo() {
  const [date, setDate] = useState<Date>();
  const [disabled, setDisabled] = useState(false);
  const [dateOption, setDateOption] = useState<
    "today" | "tomorrow" | "next-week" | "date" | ""
  >("");

  function submit(e: any) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

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

    setDisabled(true);
    api
      .post("/api/todo", {
        userId: "id",
        name: formData.get("name"),
        description: formData.get("description"),
        date: d,
      })
      .then((res) => {
        if (res.data.done) {
          toast.success("Todo added successfully");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((e) => {
        toast.error(e.message);
      })
      .finally(() => {
        setDisabled(false);
      });
  }

  return (
    <form onSubmit={submit}>
      <div className="flex flex-col gap-2 rounded border p-2">
        <Input placeholder="Add a todo" name="name" autoComplete="off" />
        <Textarea
          placeholder="Describe your todo here (optional)"
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
                <SelectItem value="remove" className="w-full cursor-pointer">
                  <div className="w-full border p-2 text-center text-destructive">
                    Remove Due Date
                  </div>
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
      </div>
    </form>
  );
}

export default AddTodo;
