import { z } from "zod";
import { TodoFormSchema } from "./forms";

export type TodoType = z.infer<typeof TodoFormSchema>;
