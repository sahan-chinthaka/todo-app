import { loggedUser } from "@/lib/firebase-admin";
import { TodoFormSchema } from "@/lib/forms";
import connectMongo from "@/lib/mongodb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const { id } = await params;

  try {
    await connectMongo();

    const uid = await loggedUser(req);

    if (!uid) throw new Error("Unauthorized");

    await Todo.deleteOne({ _id: id, userId: uid }).exec();

    return NextResponse.json({ done: true });
  } catch (error: any) {
    return NextResponse.json({ done: false, message: error.message });
  }
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const { id } = await params;

  try {
    await connectMongo();

    const uid = await loggedUser(req);

    if (!uid) throw new Error("Unauthorized");

    const data = await req.json();
    const zData = TodoFormSchema.parse(data);

    if (zData.date) {
      await Todo.updateOne(
        { _id: id, userId: uid },
        {
          name: zData.name,
          description: zData.description,
          date: zData.date,
        },
      ).exec();
    } else {
      await Todo.updateOne(
        { _id: id, userId: uid },
        {
          $unset: { date: 1 },
          name: zData.name,
          description: zData.description,
        },
      ).exec();
    }

    return NextResponse.json({ done: true });
  } catch (error: any) {
    return NextResponse.json({ done: false, message: error.message });
  }
}
