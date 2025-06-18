import { z } from "zod";
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters long" }),
});
export type LoginSchemaType = z.infer<typeof LoginSchema>;
