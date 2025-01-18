import admin from "firebase-admin";
import { NextRequest } from "next/server";

const credential = admin.credential.cert({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_API_KEY?.replace(/\\n/g, "\n"),
});

if (!admin.apps.length) {
  admin.initializeApp({
    credential,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export async function loggedUser(req: NextRequest): Promise<string | null> {
  const token = req.headers.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return null;
  }

  const decodedToken = await admin.auth().verifyIdToken(token);
  const uid = decodedToken.uid;

  return uid;
}

export const AdminAuth = admin.auth();
