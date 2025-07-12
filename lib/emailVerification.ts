import { DB } from "./db";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";
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

export const sendEmailVerificationToken = async (
  email: string,
  token: string
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const emailVerificationLink = `${process.env.BASE_URL}/email-verification?token=${token}`;

  const res = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your Email 🎉",
    html: ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; text-align: center;">
        <h2 style="color: #1E3A8A;">Verify Your Email</h2>
        <p style="color: #444; font-size: 16px;">
          Thank you for signing up! Please confirm your email address by clicking the button below.
        </p>
        <div style="margin: 20px 0;">
          <a href="${emailVerificationLink}" 
            style="background-color: #155dfc; color: white; padding: 14px 24px; text-decoration: none; 
            font-size: 16px; font-weight: bold; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>`,
  });
  return { error: res.error };
};
