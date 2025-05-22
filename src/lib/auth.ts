import NextAuth from "next-auth";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { Role } from "@prisma/client";

const adapter = PrismaAdapter(prisma);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: {
    ...adapter,
    getUserByAccount: async ({ provider, providerAccountId }) => {
      const account = await prisma.account.findFirst({
        where: {
          provider,
          providerAccountId,
        },
        include: {
          user: true,
        },
      });
      return account?.user ?? null;
    },
  },
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    GitHub({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
      },
      authorize: async (credentials) => {
        const { email } = credentials as { email: string };
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        if (!user.isActive) return null;
        return {
          ...user,
          role: user.role as Role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) return false;
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (dbUser && !dbUser?.isActive) return false;

      if (
        !dbUser &&
        user.name &&
        (account?.provider === "google" || account?.provider === "github")
      ) {
        const nameParts = user.name.split(" ");
        const firstName = nameParts[0] || null;
        const lastName = nameParts.slice(1).join(" ") || null;

        await prisma.user.create({
          data: {
            email: user.email,
            firstName,
            lastName,
            image: user.image,
            isActive: true,
          },
        });
      }

      await prisma.loginLog.create({
        data: {
          userEmail: user.email,
          method: account?.provider || "unknown",
          type: "login",
          timestamp: new Date(),
        },
      });

      await prisma.notification.create({
        data: {
          title: "ورود جدید",
          description: `${user.email} با ${account?.provider} وارد شد.`,
        },
      });

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.image || null,
          role: user.role,
        };
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
      });

      if (!dbUser || !dbUser.isActive) {
        return null;
      }

      return {
        ...token,
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        picture: dbUser.image || null,
        role: dbUser.role,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.image = token.picture as string | null;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
