"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const EmailSchema = z.string().email();

function ForgotPassword() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | undefined>();
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);

  function sendMail() {
    if (inputRef.current) {
      setError(undefined);

      let email = inputRef.current.value;

      try {
        email = EmailSchema.parse(email);

        setDisabled(true);
        sendPasswordResetEmail(Auth, email)
          .then(() => {
            setOpen(false);
            toast("Password reset link sent!");
          })
          .catch((e) => {
            console.log(e);
            setError("Unknown error");
          })
          .finally(() => {
            setDisabled(false);
          });
      } catch {
        setError("Invalid email");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer text-center text-gray-500">
          Forgot password?
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogDescription>
            This will send a password reset link to your email
          </DialogDescription>
        </DialogHeader>
        <div>
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input ref={inputRef} placeholder="Email Address" />
            </FormControl>
            {error && <FormMessage>{error}</FormMessage>}
          </FormItem>
        </div>
        <DialogFooter>
          <Button disabled={disabled} onClick={sendMail} type="button">
            Send Mail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ForgotPassword;
