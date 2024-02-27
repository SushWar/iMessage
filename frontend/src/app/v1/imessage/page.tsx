import { authConfig } from "@/lib/authProvider/auth"
import { getServerSession } from "next-auth"
import MessageClientPage from "./clientPage"
import { useRouter } from "next/router"
import { Spinner } from "@chakra-ui/react"

export default async function MessageServerPage() {
  const session = await getServerSession(authConfig)

  return <>{session && <MessageClientPage session={session} />}</>
}
