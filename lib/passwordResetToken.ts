import { DB } from "./db";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";

/**
 * Token ke zariye database se password reset token nikaalne ka function
 * Agar token nahi mila ya error aaya to null return karega
 */
export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await DB.passwordResetToken.findUnique({
      where: { token },
    });
    return passwordResetToken;
  } catch {
    return null; // Error aane par null return karega
  }
};

/**
 * Email ke zariye database se password reset token nikaalne ka function
 * Agar token nahi mila ya error aaya to null return karega
 */
export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await DB.passwordResetToken.findFirst({
      where: { email },
    });
    return passwordResetToken;
  } catch {
    return null; // Error aane par null return karega
  }
};

/**
 * Naya password reset token generate karne ka function
 * - Pehle se agar token maujood hai to delete kar deta hai
 * - Phir naya token generate karta hai 1 ghante ke liye
 */
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4(); // Unique token generate kiya
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 ghanta expiry set kiya

  // Agar pehle se token maujood ho to delete kar do
  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await DB.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  // Naya token database mein store karo
  const passwordResetToken = await DB.passwordResetToken.create({
    data: { email, token, expires },
  });

  return passwordResetToken;
};

/**
 * Password reset email bhejne ka function
 * - Resend API ka use karke user ko reset link bhejta hai
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const resetLink = `${process.env.BASE_URL}/password-reset-form?token=${token}`;

  // Email design aur sending ka process
  const res = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Password reset Link 🎉",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; text-align: center;">
  <h2 style="color: #1E3A8A;">Reset Your Password</h2>
  <p style="color: #444; font-size: 16px;">
    We received a request to reset your password. Click the button below to set a new one.
  </p>
  <div style="margin: 20px 0;">
    <a href="${resetLink}" 
      style="background-color: #155dfc; color: white; padding: 14px 24px; text-decoration: none; 
      font-size: 16px; font-weight: bold; border-radius: 5px; display: inline-block;">
      Reset Password
    </a>
  </div>
  <p style="color: #666; font-size: 14px;">
    If you didn’t request this, you can safely ignore this email.
  </p>
</div>
`,
  });

  // Agar koi error aaya to woh return karo
  return { error: res.error };
};
