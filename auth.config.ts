// Importing the Credentials provider from NextAuth.js for custom email/password login
import Credentials from "next-auth/providers/credentials";
// Importing the type for config validation to ensure the object matches expected structure
import type { NextAuthConfig } from "next-auth";
// Importing bcryptjs for securely comparing hashed passwords
import bcrypt from "bcryptjs";
// Importing the Zod validation schema for login form input validation
import { LoginSchema } from "./schemas/LoginSchema";
// Custom helper to fetch user from the database by email
import { getUserByEmail } from "./lib/user";

// This is the NextAuth configuration object, used in `NextAuth()` initialization
export default {
  providers: [
    // Using the custom credentials provider for email/password login
    Credentials({
      async authorize(credentials) {
        // Validate the submitted credentials using Zod schema
        const validateFields = LoginSchema.safeParse(credentials);

        // Only proceed if validation is successful
        if (validateFields.success) {
          const { email, password } = validateFields.data;

          // Try to find the user in the database by email
          const user = await getUserByEmail(email);

          // If user doesn't exist or has no password (e.g., OAuth-only user), reject login
          if (!user || !user.password) return null;

          // Compare the entered password with the hashed password in DB
          const isCorrectPassword = await bcrypt.compare(
            password,
            user.password
          );

          // If passwords match, return user object to complete login
          if (isCorrectPassword) return user;
        }

        // If validation fails or password is incorrect, return null to reject login
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig; // Type check to ensure config matches NextAuth structure
