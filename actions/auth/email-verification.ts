"use server";

import { DB } from "@/lib/db";
import { getUserByEmail } from "@/lib/user";

// Server par token verify karne ka function
export const verifyEmail = async (token: string) => {
  // Token ko DB se dhoondhna
  const emailVerificationToken = await DB.emailVerificationToken.findUnique({
    where: { token },
  });

  // Agar token nahi mila toh error return karo
  if (!emailVerificationToken) return { error: "verification token not found" };

  // Check karo ke token expire ho gaya hai ya nahi
  const isExpired = new Date(emailVerificationToken.expires) < new Date();
  if (isExpired) return { error: "verification token expired" };

  // Email se user check karo ke exist karta hai ya nahi
  const existingUser = await getUserByEmail(emailVerificationToken.email);
  if (!existingUser) return { error: "user not found" };

  // Agar user mil gaya aur token valid hai, toh uska email verified set karo
  await DB.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: new Date(), email: emailVerificationToken.email },
  });

  return { success: "email verified" };
};

// Ye code token ko validate karta hai jab user link par click karta hai, aur agar sab kuch theek ho toh user ka email "verified" kar deta hai.
