import { authConfig } from "@/lib/authProvider/auth"
import { getServerSession } from "next-auth"
import MessageClientPage from "./clientPage"

export default async function MessageServerPage() {
  const session = await getServerSession(authConfig)

  return <>{session && <MessageClientPage session={session} />}</>
}
