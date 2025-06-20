import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { DB } from "./lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(DB),
  session: { strategy: "jwt" },
  // Merge with additional auth config from separate file
  ...authConfig,

  // Authentication event handlers
  events: {
    /**
     * Automatically verify email when user links an OAuth account
     * @param user - The user object from the authentication provider
     */
    async linkAccount({ user }) {
      await DB.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }, // Mark email as verified
      });
    },
  },
  pages: {
    signIn: "/login",
  },
});
