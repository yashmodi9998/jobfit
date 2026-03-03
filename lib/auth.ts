import NextAuth from "next-auth";
import dbConnect from "@/lib/dbConfig";
import User from "@/app/model/userModel";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // The authorize function is where we validate the user's credentials. We connect to the database, find the user by email, and compare the hashed password.
  providers: [
    Credentials({
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        
        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (isPasswordCorrect) return user;
        return null;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // This option allows users to link their Google account even if another account with the same email exists.
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    // This runs when a user tries to sign in
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create the user in MongoDB if they don't exist
            await User.create({
              name: user.name,
              email: user.email,
              // Since they use Google, they don't have a password
              createdAt: new Date(),
            });
          }
          return true; // Allow sign in
        } catch (error) {
          console.error("Error saving Google user:", error);
          return false; // Prevent sign in on DB error
        }
      }
      return true; // Allow credentials sign in
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});