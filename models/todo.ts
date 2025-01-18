import { ITodo } from "@/lib/types";
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema<ITodo>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default Todo;
