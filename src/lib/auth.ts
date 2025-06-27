import { NextAuthOptions } from "next-auth"
import type { Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import type { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: Role
      avatar?: string | null
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    role: Role
    avatar?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
    avatar?: string | null
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            return null
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isValidPassword) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.role = user.role
        token.avatar = user.avatar
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role
        session.user.avatar = token.avatar
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}
