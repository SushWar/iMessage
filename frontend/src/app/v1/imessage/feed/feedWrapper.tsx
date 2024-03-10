"use client"
import { Flex } from "@chakra-ui/react"
import { Session } from "next-auth"
import { useSearchParams } from "next/navigation"

interface Wrapper {
  session: Session | null
}

export default function FeddWrapper({ session }: Wrapper) {
  const searchParams = useSearchParams()

  const search = searchParams.get("conversationId")

  return (
    <Flex
      display={{ base: search ? "flex" : "none", md: "flex" }}
      width="100%"
      direction="column"
    >
      Feed wrapper
      <div>{search ? <Flex>{search}</Flex> : <div>No Conversation</div>}</div>
    </Flex>
  )
}
