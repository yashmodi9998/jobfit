import NextAuth from "next-auth";
import dbConnect from "@/lib/dbConfig";
import User from "@/app/model/userModel";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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

        // Return the user object; MongoDB _id will be available as user._id
        if (isPasswordCorrect) return user;
        return null;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              createdAt: new Date(),
            });
            // Attach the string version of the new MongoDB ID to the user object
            user.id = newUser._id.toString();
          } else {
            // Attach the string version of the existing MongoDB ID to the user object
            user.id = existingUser._id.toString();
          }
          return true; 
        } catch (error) {
          console.error("Error saving Google user:", error);
          return false;
        }
      }
      return true;
    },

    // 1. Map the database ID to the JWT token
    async jwt({ token, user }) {
      if (user) {
        // 'user.id' is set in the authorize() or signIn() steps above
        token.id = user.id; 
      }
      return token;
    },

    // 2. Transfer the ID from the JWT token to the Session
    async session({ session, token }) {
      if (session.user) {
        // session.user.id is what you will use in your app
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});