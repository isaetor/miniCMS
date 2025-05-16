import { Role } from "@prisma/client"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role: Role
    firstName?: string | null
    lastName?: string | null
  }

  interface Session {
    user: {
      id: string
      email: string
      firstName: string | null
      lastName: string | null
      image: string | null
      role: Role
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
    firstName?: string | null
    lastName?: string | null
  }
} 