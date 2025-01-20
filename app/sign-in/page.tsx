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
import { useToast } from "@/hooks/use-toast";
import { Auth } from "@/lib/firebase";
import { SignInFormSchema } from "@/lib/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ForgotPassword from "./forgot-password";

const provider = new GoogleAuthProvider();

function SignInPage() {
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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
      <div className="mx-auto mt-2 w-full max-w-[400px] rounded border border-gray-200 p-5 shadow-sm sm:mt-10">
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
            <ForgotPassword />
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
        <div className="mt-5">
          <Button
            disabled={disabled}
            variant="outline"
            className="flex w-full items-center justify-center gap-2 font-semibold"
            onClick={() => {
              signInWithPopup(Auth, provider)
                .then(() => {
                  router.push("/");
                })
                .catch((e) => {
                  toast({ title: "Error: " + e.code });
                });
            }}
          >
            <img src="/google.png" alt="Google icon" width={20} />
            <span>Continue with Google</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
