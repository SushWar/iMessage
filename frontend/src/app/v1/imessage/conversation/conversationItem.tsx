import { SearchUsersInput, SearchUsersOutput } from "@/util/type"
import { useLazyQuery, useQuery } from "@apollo/client"
import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react"
import { format, isYesterday, isToday } from "date-fns"
import { userCommands } from "@/graphql/operations/user"
import { useEffect } from "react"

interface Wrapper {
  conversation: any
  userId: string
  onViewConversation: (conversationId: string) => void
  isSelected: boolean
}

export default function ConverstaionItem({
  conversation,
  onViewConversation,
  isSelected,
  userId,
}: Wrapper) {
  function formatUpdatedAt(updatedAt: Date): string {
    if (isToday(updatedAt)) {
      return format(updatedAt, "h:mma") // Show time for today (e.g., 8:40PM, 11:00AM)
    } else if (isYesterday(updatedAt)) {
      return "Yesterday"
    } else {
      return format(updatedAt, "dd/MM/yyyy") // Show date for older messages
    }
  }

  return (
    <>
      <Stack
        direction="row"
        align="center"
        justify="space-between"
        my={4}
        p={4}
        bg={isSelected ? "whiteAlpha.200" : "none"}
        _hover={{ bg: "whiteAlpha.200" }}
        borderRadius={4}
        onClick={() => {
          onViewConversation(conversation.conversationId)
        }}
      >
        <Avatar />
        <Flex justify="space-between" width="80%" height="100%">
          {/* <Text cursor={"pointer"}>{conversation.conversationId}</Text> */}
          <Text
            fontWeight={600}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {conversation.name}
          </Text>
          <Text color="whiteAlpha.700" textAlign="right">
            {formatUpdatedAt(conversation.updatedAt)}
          </Text>
        </Flex>
      </Stack>
    </>
  )
}
