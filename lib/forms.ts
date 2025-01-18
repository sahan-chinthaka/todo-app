import { z } from "zod";

export const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password shouldn't be empty"),
});

export const SignUpFormSchema = z
  .object({
    name: z.string().trim().min(3, "Minimum name length is 3"),
    email: z.string().email(),
    password: z.string().min(6, "Minimum password length is 6"),
    passwordConfirm: z.string(),
  })
  .superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["passwordConfirm"],
      });
    }
  });
