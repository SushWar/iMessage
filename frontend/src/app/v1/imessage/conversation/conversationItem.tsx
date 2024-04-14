import {
  ConversationFetchDetails,
  SearchUsersInput,
  SearchUsersOutput,
} from "@/util/type"
import { useLazyQuery, useQuery } from "@apollo/client"
import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react"
import { format, isYesterday, isToday } from "date-fns"
import { userCommands } from "@/graphql/operations/user"
import { useEffect, useState } from "react"
import { GoDotFill } from "react-icons/go"

interface Wrapper {
  conversation: ConversationFetchDetails
  userId: string
  onViewConversation: (
    conversationId: string,
    hasSeenLastMessage: boolean
  ) => void
  isSelected: boolean
}

export default function ConverstaionItem({
  conversation,
  onViewConversation,
  isSelected,
  userId,
}: Wrapper) {
  const [lastSeenMessage, setLastSeenMessage] = useState(true)

  function formatUpdatedAt(updatedAt: Date): string {
    if (isToday(updatedAt)) {
      return format(updatedAt, "h:mma") // Show time for today (e.g., 8:40PM, 11:00AM)
    } else if (isYesterday(updatedAt)) {
      return "Yesterday"
    } else {
      return format(updatedAt, "dd/MM/yyyy") // Show date for older messages
    }
  }

  useEffect(() => {
    const updateLastSeen = !!conversation.hasSeenLastMessage.find(
      (item) => item === userId
    )
    setLastSeenMessage(updateLastSeen)
  }, [conversation.hasSeenLastMessage])

  // const lastSeenMessage = !!conversation.hasSeenLastMessage.find(
  //   (item) => item === userId
  // )
  // console.log(conversation)

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
          onViewConversation(conversation.id, lastSeenMessage)
        }}
        cursor="pointer"
      >
        <Flex position="absolute" left="0px">
          {!lastSeenMessage && <GoDotFill fontSize={18} color="#6B46C1" />}
        </Flex>
        <Avatar />
        {/* <Text cursor={"pointer"}>{conversation.conversationId}</Text> */}
        <Flex justify="space-between" width="80%" height="100%">
          <Flex direction="column" width="70%" height="100%">
            <Text
              fontWeight={600}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {conversation.name
                ? conversation.name
                : formatName(conversation.participants, userId)}
            </Text>
            {conversation.latestMessage && (
              <Box width="140%">
                <Text
                  color="whiteAlpha.700"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {conversation.latestMessage}
                </Text>
              </Box>
            )}
          </Flex>
          <Text color="whiteAlpha.700" textAlign="right">
            {formatUpdatedAt(conversation.updatedAt)}
          </Text>
        </Flex>
      </Stack>
    </>
  )
}

const formatName = (participant: Array<any>, userSessionId: string): string => {
  const usernames = participant
    .filter((participant) => participant._id != userSessionId)
    .map((participant) => participant.username)

  return usernames.join(", ")
}
