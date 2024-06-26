"use client"
import { Box, Text } from "@chakra-ui/react"
import { Session } from "next-auth"
import ConversationModal from "./modal/modal"
import { useState } from "react"
import ConverstaionItem from "./conversationItem"
import { useSearchParams } from "next/navigation"

interface Wrapper {
  session: Session
  conversations: Array<any>
  onViewConversation: (
    conversationId: string,
    hasSeenLastMessage: boolean
  ) => void
}

export default function ConverstaionList({
  session,
  conversations,
  onViewConversation,
}: Wrapper) {
  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()
  const isSelectedConversation = searchParams.get("conversationId")
  const {
    user: { id: userId },
  } = session

  const onOpen = () => {
    setIsOpen(true)
  }
  const onClose = () => {
    setIsOpen(false)
  }
  return (
    <Box width={"100%"}>
      <Box
        py={2}
        px={2}
        mb={4}
        bg={"blackAplha.300"}
        borderRadius={4}
        cursor={"pointer"}
        onClick={onOpen}
      >
        <Text textAlign={"center"} color={"whiteAplha.800"} fontWeight={500}>
          Find or start a converstaion
        </Text>
      </Box>
      <ConversationModal session={session} isopen={isOpen} onClose={onClose} />
      {conversations.map((conver, key) => {
        return (
          <ConverstaionItem
            key={key}
            userId={userId}
            conversation={conver}
            onViewConversation={onViewConversation}
            isSelected={isSelectedConversation === conver.conversationId}
          />
        )
      })}
    </Box>
  )
}
