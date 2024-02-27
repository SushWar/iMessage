import clientPromise from "@/mongodb/mongoAdapter"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { NextAuthOptions } from "next-auth"
import type { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_SIGN_IN_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SIGN_IN_CLIENT_SECRET as string,
    }),
  ],
  // session: {
  //   strategy: "jwt",
  // },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  callbacks: {
    async jwt({ token, user }) {
      // console.log("\nToken in JWT --> \n", token)
      // console.log("\nUser in JWT --> \n", user)
      return token
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async session({ session, token, user }) {
      // console.log("\nsession in session --> \n", session)
      // console.log("\ntoken in session --> \n", token)
      // console.log("\nuser in session --> \n", user)
      // const sessionUser = { ...session.user, ...user }

      const searchUsers1 = {
        id: user.id,
        name: user.name,
        onboarding: user.onboarding,
        username: user.username,
      }

      return Promise.resolve({
        ...session,
        user: searchUsers1,
      })
    },
  },
}
