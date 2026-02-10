import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      coins: number;
    } & DefaultSession["user"]
  }

  interface User {
    role?: string;
    coins?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    coins: number;
  }
}
