import { loggedUser } from "@/lib/firebase-admin";
import { TodoFormSchema } from "@/lib/forms";
import connectMongo from "@/lib/mongodb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const uid = await loggedUser(req);

    if (!uid) throw new Error("Unauthorized");

    const todos = await Todo.find({ userId: uid }).sort({ date: 1 });

    return NextResponse.json({ done: true, todos });
  } catch (error: any) {
    return NextResponse.json({ done: false, message: error.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const uid = await loggedUser(req);

    if (!uid) throw new Error("Unauthorized");

    const data = await req.json();
    const zData = TodoFormSchema.parse(data);

    const todo = new Todo({
      name: zData.name,
      description: zData.description,
      date: zData.date,
      userId: uid,
    });

    await todo.save();

    return NextResponse.json({ done: true, todo });
  } catch (error: any) {
    return NextResponse.json({ done: false, message: error.message });
  }
}
