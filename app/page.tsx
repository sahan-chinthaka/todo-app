"use client";

import { useAuth } from "@/context/auth";
import { api } from "@/lib/utils";
import { useEffect } from "react";

export default function Home() {
  const auth = useAuth();

  useEffect(() => {
    if (auth) {
      api.get("/api/todo").then((res) => {
        console.log(res.data);
      });
    }
  }, [auth]);

  return "Todo App";
}
