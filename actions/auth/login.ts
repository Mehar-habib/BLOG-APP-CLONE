"use server"; // Enables server-side actions in Next.js (used in App Router)

// Import required functions and types
import { signIn } from "@/auth"; // Auth.js (NextAuth) signIn method
import {
  generateEmailVerificationToken,
  sendEmailVerificationToken,
} from "@/lib/emailVerification";
import { getUserByEmail } from "@/lib/user"; // DB query to get user by email
import { LOGIN_REDIRECT } from "@/routes"; // Path to redirect after successful login
import { LoginSchema, LoginSchemaType } from "@/schemas/LoginSchema"; // Zod schema and types for login form validation
import { AuthError } from "next-auth"; // Custom error from Auth.js for handling login issues

// Server action to handle user login logic
export const login = async (values: LoginSchemaType) => {
  // Validate input values using Zod schema
  const validateFields = LoginSchema.safeParse(values);

  // If validation fails, return error
  if (!validateFields.success) {
    return { error: "Invalid fields" };
  }

  // Extract email and password from validated data
  const { email, password } = validateFields.data;

  // Fetch user from database using email
  const user = await getUserByEmail(email);

  // Return error if user is not found or missing required fields
  if (!user || !email || !password || !user.password) {
    return { error: "Invalid credentials" };
  }

  if (!user.emailVerified) {
    const emailVerificationToken = await generateEmailVerificationToken(
      user.email
    );
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

    // Agar user ka email abhi tak verify nahi hua, toh dobara se verification email send ki jati hai.
  }
  try {
    // Attempt to sign in with credentials, and redirect on success
    await signIn("credentials", {
      email,
      password,
      redirectTo: LOGIN_REDIRECT,
    });
  } catch (error) {
    // If Auth.js throws an error, handle it accordingly
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
  }
};
