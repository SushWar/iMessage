"use client"
import { Flex } from "@chakra-ui/react"
import { Session } from "next-auth"
import { useSearchParams } from "next/navigation"
import MessageHeader from "./messages/header"
import MessageInput from "./messages/input"
import ConversationMessages from "./messages/messages"

interface Wrapper {
  session: Session | null
}

export default function FeddWrapper({ session }: Wrapper) {
  const searchParams = useSearchParams()

  const conversationId = searchParams.get("conversationId")

  return (
    <Flex
      display={{ base: conversationId ? "flex" : "none", md: "flex" }}
      width="100%"
      direction="column"
    >
      {session?.user && conversationId && (
        <>
          <Flex
            direction="column"
            justify="space-between"
            overflow="hidden"
            flexGrow={1}
          >
            <MessageHeader
              userID={session.user.id}
              conversationId={conversationId}
            />
            <ConversationMessages
              conversationId={conversationId}
              userId={session.user.id}
            />
          </Flex>
          <MessageInput session={session} conversationId={conversationId} />
        </>
      )}
      {/* <div>{search ? <Flex>{search}</Flex> : <div>No Conversation</div>}</div> */}
    </Flex>
  )
}
