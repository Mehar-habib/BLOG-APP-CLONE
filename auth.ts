import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { DB } from "./lib/db";
import { getUserByEmail } from "./lib/user";

// 👇 Is block mein hum NextAuth ke session object ko extend kar rahe hain custom fields ke sath
declare module "next-auth" {
  interface Session {
    user: {
      role: "USER" | "ADMIN"; // User ka role (authorization purpose ke liye)
      userId: string; // Unique ID jo database se milti hai
    } & DefaultSession["user"]; // NextAuth ke default user fields bhi rahenge
  }
}

// 👇 NextAuth initialize ho raha hai yahan, destructured handlers etc. use kiye ja rahe hain
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(DB), // Prisma adapter se NextAuth ko DB se connect kiya

  session: { strategy: "jwt" }, // JWT token based session use kiya ja raha hai

  ...authConfig, // External auth config merge kiya gaya (jaise providers etc.)

  // 👇 Authentication ke baad ke events handle karne ke liye
  events: {
    /**
     * Jab user apne account ko kisi OAuth provider (Google, GitHub) se link karta hai,
     * to uska email automatically verify kar dete hain.
     */
    async linkAccount({ user }) {
      await DB.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }, // Email ko verified mark kar diya
      });
    },
  },

  // 👇 JWT aur session customize karne ke liye callbacks define kiye
  callbacks: {
    // JWT callback - token ke andar extra info store karte hain (role, userId)
    async jwt({ token }) {
      if (!token.email) return token; // Agar email nahi hai, token as-is return
      const user = await getUserByEmail(token.email); // DB se user find karo
      if (!user) return token;
      token.role = user.role; // User ka role token mein daal diya
      token.userId = user.id; // User ID bhi token mein daal di
      return token;
    },

    // Session callback - token ke data ko session mein inject karte hain
    async session({ session, token }) {
      if (token.role) {
        session.user.role = token.role as "USER" | "ADMIN"; // Role set karo session.user mein
      }
      if (token.userId) {
        session.user.userId = token.userId as string; // userId bhi set karo session.user mein
      }
      return session; // Modified session return karo
    },
  },

  // 👇 Custom pages define karne ke liye
  pages: {
    signIn: "/login", // Default login page ko replace kiya custom route se
  },
});
