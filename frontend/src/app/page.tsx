import { authConfig } from "@/lib/authProvider/auth"
import type { Session } from "next-auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Home(context: any) {
  const session: Session | null = await getServerSession(authConfig)

  if (!session) {
    return redirect("/auth/login")
  } else if (!session.user.onboarding) {
    return redirect("/onboarding")
  }

  return redirect(`/v1/imessage`)
}
