import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { NextAuthOptions } from "next-auth";
import { UserCredentials, AuthUser } from "@/types/authTypes";

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        const { email, password, role } = credentials as UserCredentials;
        if (!email || !password! || !role) {
          throw new Error("Missing credentials or role.");
        }
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("No user found or password not set.");
        }
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          throw new Error("Invalid password.");
        }

        if (!user.role) {
          throw new Error("Role not assigned. Please register again.");
        }
        if (user.role !== role) {
          throw new Error("Role mismatch. Please select the correct role.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // on first signin
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      // Check DB if role is missing
      // Check DB if role is missing or default
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (dbUser) {
          let updatedRole = dbUser.role;
          const cookieRole = (await cookies()).get("oauth_role")?.value as
            | "CANDIDATE"
            | "RECRUITER"
            | undefined;

          if (
            cookieRole &&
            dbUser.role === "CANDIDATE" &&
            cookieRole !== "CANDIDATE"
          ) {
            await prisma.user.update({
              where: { email: token.email },
              data: { role: cookieRole },
            });

            (await cookies()).delete("oauth_role");
            updatedRole = cookieRole;
          }

          token.role = updatedRole;
          token.id = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role;
      }
      return session;
    },
    redirect({ baseUrl }) {
      console.log(baseUrl);
      return `${baseUrl}/extra/redirect-me`;
    },
  },
};
