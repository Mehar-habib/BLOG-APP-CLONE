import { DB } from "./db";
import { v4 as uuidv4 } from "uuid";

/**
 * Fetches an existing email verification token for a given email.
 * Returns null if not found or if there's an error.
 */
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await DB.emailVerificationToken.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch {
    return null; // Return null if DB query fails
  }
};

/**
 * Generates a new email verification token.
 * - Deletes any existing token for the email.
 * - Creates a new token with 1-hour expiration.
 */
export const generateEmailVerificationToken = async (email: string) => {
  const token = uuidv4(); // Generate unique token
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Set expiry to 1 hour from now

  // Check and delete any existing token for the same email
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await DB.emailVerificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  // Create and store new verification token
  const emailVerificationToken = await DB.emailVerificationToken.create({
    data: { email, token, expires },
  });

  return emailVerificationToken;
};
