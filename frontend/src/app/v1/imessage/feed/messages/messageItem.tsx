import { MessageFields } from "@/util/type"
import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react"
import { format, isYesterday, isToday } from "date-fns"

interface MessageItemWrapper {
  message: MessageFields
  sendByMe: boolean
  conversationId: string
}

export default function MessageItem({
  message,
  sendByMe,
  conversationId,
}: MessageItemWrapper) {
  function formatUpdatedAt(updatedAt: string): string {
    //    if (isToday(updatedAt)) {
    //      return format(updatedAt, "h:mma") // Show time for today (e.g., 8:40PM, 11:00AM)
    //    } else if (isYesterday(updatedAt)) {
    //      return "Yesterday"
    //    } else {
    //      return format(updatedAt, "dd/MM/yyyy") // Show date for older messages
    //    }
    return format(updatedAt, "h:mma")
  }
  if (conversationId !== message.conversationId) {
    return <></>
  }
  return (
    <Stack
      direction="row"
      p={4}
      spacing={4}
      //   _hover={{ bg: "whiteAlpha.200" }}
      justify={sendByMe ? "flex-end" : "flex-start"}
      wordBreak="break-word"
    >
      {message.body && (
        <>
          {!sendByMe && (
            <Flex>
              <Avatar size="md" />
            </Flex>
          )}
          <Stack spacing={1} width="100%">
            <Stack
              direction="row"
              align="center"
              justify={sendByMe ? "flex-end" : "flex-start"}
            >
              {!sendByMe && (
                <Text fontSize={14} color="whiteAlpha.700">
                  {message.senderId.username}
                </Text>
              )}
              <Text fontSize={14} color="whiteAlpha.700">
                {formatUpdatedAt(message.createdAt)}
              </Text>
            </Stack>
            <Flex justify={sendByMe ? "flex-end" : "flex-start"}>
              <Box
                bg={sendByMe ? "blue" : "whiteAlpha.300"}
                px={2}
                py={1}
                borderRadius={12}
                maxWidth="65%"
              >
                <Text>{message.body}</Text>
              </Box>
            </Flex>
          </Stack>
        </>
      )}
    </Stack>
  )
}
