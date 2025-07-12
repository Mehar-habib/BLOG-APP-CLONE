"use server";
import { DB } from "@/lib/db";
import {
  generateEmailVerificationToken,
  sendEmailVerificationToken,
} from "@/lib/emailVerification";
import { getUserByEmail } from "@/lib/user";
import { RegisterSchema, RegisterSchemaType } from "@/schemas/RegisterSchema";
import bcrypt from "bcryptjs";

export const signUp = async (values: RegisterSchemaType) => {
  const validateFields = RegisterSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields" };
  }
  const { name, email, password } = validateFields.data;
  const user = await getUserByEmail(email);
  if (user) {
    return { error: "User already exists" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await DB.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Generated a verification token for the user's email (with expiry time and UUID)
  const emailVerificationToken = await generateEmailVerificationToken(email);

  // Attempted to send the verification email to the user with the token
  const { error } = await sendEmailVerificationToken(
    emailVerificationToken.email,
    emailVerificationToken.token
  );

  // If an error occurred while sending the email, return an error message
  if (error) {
    return {
      error:
        "Something went wrong while sending the verification email! Please try again",
    };
  }

  // If everything went fine, return a success message
  return { success: "Verification email sent!" };
};
