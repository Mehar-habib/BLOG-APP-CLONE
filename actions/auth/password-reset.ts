"use server";
import { DB } from "@/lib/db";
import { getPasswordResetTokenByToken } from "@/lib/passwordResetToken";
import { getUserByEmail } from "@/lib/user";
import {
  PasswordResetSchema,
  PasswordResetSchemaType,
} from "@/schemas/PasswordResetSchema";
import bcrypt from "bcryptjs";

export const passwordReset = async (
  values: PasswordResetSchemaType,
  token?: string | null
) => {
  if (!token) {
    return { error: "Token not found" };
  }
  const validatedFields = PasswordResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Password" };
  }
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Token not found" };
  }
  const isExpired = new Date(existingToken.expires) < new Date();
  if (isExpired) {
    return { error: "Token expired" };
  }
  const user = await getUserByEmail(existingToken.email);
  if (!user) {
    return { error: "User not found" };
  }
  const { password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  await DB.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });
  await DB.passwordResetToken.delete({ where: { id: existingToken.id } });
  return { success: "Password reset successfully" };
};
