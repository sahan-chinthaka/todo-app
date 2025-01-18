"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const auth = useAuth();
  const [date, setDate] = useState<Date>();
  const [dateOption, setDateOption] = useState<
    "today" | "tommorow" | "next-week" | "date" | undefined
  >(undefined);

  return (
    <div className="container mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          console.log(formData, dateOption, date);
        }}
      >
        <div className="flex flex-col gap-2 rounded border p-2">
          <Input placeholder="Add a todo" name="name" />
          <Textarea
            placeholder="Describe your todo here (optional)"
            className="max-h-[150px]"
            name="description"
          ></Textarea>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row">
            <Select
              name="date"
              onValueChange={(value: any) =>
                setDateOption(value == "remove" ? null : value)
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
            <Button className="sm:ml-auto" variant="outline" type="submit">
              Add
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
