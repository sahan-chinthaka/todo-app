import { loggedUser } from "@/lib/firebase-admin";
import connectMongo from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectMongo();

  const uid = await loggedUser(req);

  return NextResponse.json({ done: true, uid });
}
