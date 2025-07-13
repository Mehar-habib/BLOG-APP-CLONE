import { z } from "zod";

export const PasswordResetSchema = z
  .object({
    password: z
      .string()
      .min(3, { message: "Password must be at least 3 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordResetSchemaType = z.infer<typeof PasswordResetSchema>;
