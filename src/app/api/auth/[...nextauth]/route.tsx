import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      name: "GitHub",
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // This callback runs when a user signs in
      if (account?.provider === "github") {
        // Check if user exists, if not, PrismaAdapter will create it
        const existingUser = await prisma.user.findFirst({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Optionally, you can customize user creation here
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              githubUsername: profile?.login
            },
          })
          console.log( new Date().getTime()  + "New user signed in:", user);
        }
      }
      return true; // Return true to allow sign-in
    },
  },
  pages: {
    signIn: "/auth/signIn",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
