"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { Auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import ResetPassword from "./reset-password";

function AccountPage() {
  const auth = useAuth();

  if (auth === undefined) return;

  if (auth === null) {
    return (
      <div>
        <div className="mx-auto mt-10 max-w-[400px] space-y-4 rounded border p-5">
          <h2>You are not signed in</h2>
          <p>Sign in here</p>
          <div>
            <Link href="/sign-in">
              <Button>Sign in</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[500px] rounded border bg-white p-5 shadow">
      <table>
        <tbody className="[&>tr]:leading-10">
          <tr>
            <td className="w-36">Name</td>
            <td>{auth.displayName}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{auth.email}</td>
          </tr>
          {auth.metadata.lastSignInTime && (
            <tr>
              <td>Last Sign in time</td>
              <td>{new Date(auth.metadata.lastSignInTime).toLocaleString()}</td>
            </tr>
          )}
          {auth.metadata.creationTime && (
            <tr>
              <td>Created time</td>
              <td>{new Date(auth.metadata.creationTime).toLocaleString()}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <ResetPassword />
        <Button className="ml-2 mt-10" onClick={() => signOut(Auth)}>
          Sign out
        </Button>
      </div>
    </div>
  );
}

export default AccountPage;
