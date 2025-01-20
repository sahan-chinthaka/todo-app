import { loggedUser } from "@/lib/firebase-admin";
import connectMongo from "@/lib/mongodb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

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
