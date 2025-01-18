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
import { SignUpFormSchema } from "@/lib/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

function SignUpPage() {
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
    setDisabled(true);
    createUserWithEmailAndPassword(Auth, values.email, values.password)
      .then((cred) => {
        updateProfile(cred.user, { displayName: values.name })
          .then(() => {
            router.push("/sign-in");
            toast.success("Account created successfully");
          })
          .catch((e) => {
            toast.error(e.code);
            setDisabled(false);
          });
      })
      .catch((e) => {
        console.log(e.code);
        if (e.code == "auth/email-already-in-use") {
          form.setError("email", {
            message: "Email already in use",
          });
          toast.error("Email already in use");
        } else toast.error(e.code);
        setDisabled(false);
      });
  }

  return (
    <div>
      <div className="mx-auto mt-10 w-full max-w-[400px] rounded border border-gray-200 p-5 shadow-sm">
        <h2 className="text-center">Sign up to Todo App</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-5 space-y-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full Name"
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
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={disabled} className="w-full">
              Sign up
            </Button>
            <div className="text-center text-gray-500">
              Already have an account?&nbsp;
              <Link href="/sign-in" className="text-gray-700">
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default SignUpPage;
