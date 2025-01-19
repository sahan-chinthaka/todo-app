import { TodoType } from "@/lib/types";
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema<TodoType>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: false,
  },
});

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default Todo;
