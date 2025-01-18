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
import { FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth";
import { updatePassword } from "firebase/auth";
import { useRef, useState } from "react";
import { toast } from "sonner";

function ResetPassword() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | undefined>();
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const auth = useAuth();

  function reset() {
    if (!inputRef.current || !auth) return;
    setError(undefined);
    setDisabled(true);

    const password = inputRef.current.value;
    if (password.length < 6) {
      setError("Minimum password length is 6");
      setDisabled(false);
      return;
    }

    updatePassword(auth, password)
      .then(() => {
        setOpen(false);
        toast.success("Password changed!");
      })
      .catch((e) => {
        if (e.code == "auth/requires-recent-login") {
          toast.error(
            "Please sign out and sign in again to change your password",
          );
        } else toast.error(e.code);
      })
      .finally(() => {
        setDisabled(false);
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Reset Password</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            This will change your current password with new password
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-2">
            <label htmlFor="password">New Password</label>
            <Input
              id="password"
              name="password"
              type="password"
              ref={inputRef}
              placeholder="Password"
            />
            {error && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {error}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={reset} disabled={disabled} type="button">
            Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ResetPassword;
