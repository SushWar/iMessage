import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      onboarding: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    username: string
    onboarding: boolean
  }
}
