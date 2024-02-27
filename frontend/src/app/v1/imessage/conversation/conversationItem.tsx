import { Box, Stack, Text } from "@chakra-ui/react"
import { Session } from "next-auth"
import ConversationModal from "./modal/modal"
import { useState } from "react"

interface Wrapper {
  conversation: any
}

export default function ConverstaionItem({ conversation }: Wrapper) {
  //   console.log("INside converstion item, ", conversation)
  return (
    <>
      <Stack p={4} _hover={{ bg: "whiteAlpha.200" }} borderRadius={4}>
        <Text>{conversation.conversationId}</Text>
      </Stack>
    </>
  )
}
