"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/context/auth";
import { Skeleton } from "./ui/skeleton";

function Header() {
  const auth = useAuth();

  return (
    <header className="flex h-[76px] items-center border-b border-b-gray-200 p-5 shadow-sm">
      <div className="font-bold">
        <Link href="/">Todo App</Link>
      </div>
      <div className="ml-auto">
        {auth && (
          <Link href="/account">
            <Button variant="outline">Account</Button>
          </Link>
        )}
        {auth === null && (
          <Link href="/sign-in">
            <Button>Sign in</Button>
          </Link>
        )}
        {auth === undefined && <Skeleton className="h-9 w-20" />}
      </div>
    </header>
  );
}

export default Header;
