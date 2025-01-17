"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Auth } from "@/lib/firebase";
import { SignInFormSchema } from "@/lib/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function SignInPage() {
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof SignInFormSchema>) {
    setDisabled(true);
    signInWithEmailAndPassword(Auth, values.email, values.password)
      .then(() => {
        router.push("/");
      })
      .catch((e) => {
        if (e.code == "auth/invalid-credential") {
          form.setError("email", {
            message: "Invalid credential",
          });
        }
      })
      .finally(() => {
        setDisabled(false);
      });
  }

  return (
    <div>
      <div className="mx-auto mt-10 w-full max-w-[400px] rounded border border-gray-200 p-5 shadow-sm">
        <h2 className="text-center">Sign in to Todo App</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-5 space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email Address"
                      type="email"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="cursor-pointer text-center text-sm text-gray-500">
              Forgot password?
            </div>
            <Button type="submit" disabled={disabled} className="w-full">
              Sign in
            </Button>
            <div className="text-center text-gray-500">
              Do not have an account?&nbsp;
              <Link href="/sign-up" className="text-gray-700">
                Create Here
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default SignInPage;
