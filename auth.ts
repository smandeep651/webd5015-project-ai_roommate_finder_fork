// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "./prisma";
// import GoogleProvider from "next-auth/providers/google";
// import FacebookProvider from "next-auth/providers/facebook";
 
// export const { handlers, auth, signIn, signOut } = NextAuth({
//   debug: true,
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: "jwt" },
//   providers: [
//     GoogleProvider({
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     FacebookProvider({
//     clientId: process.env.FACEBOOK_CLIENT_ID,
//     clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
// })

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcrypt"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
 
async function getUser(email: string) {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
      
        if (!parsedCredentials.success) {
          console.log('Invalid credentials format');
          return null;
        }
      
        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
      
        // Check if user exists and has a password (for credential-based users)
        if (!user || !user.password) {
          console.log('No user found or user uses OAuth');
          return null;
        }
      
        try {
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            console.log('Password mismatch');
            return null;
          }
          return user;
        } catch (error) {
          console.error('Error comparing passwords:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session.user) {
        const dbUser = await getUser(session.user.email);
        if (dbUser) session.user.id = dbUser.id; // Add user ID to session
      }
      return session;
    },
  },
});