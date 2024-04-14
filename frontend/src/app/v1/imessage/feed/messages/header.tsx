import { conversationCommands } from "@/graphql/operations/conversation"
import { ConversationDataOutput } from "@/util/type"
import { useQuery } from "@apollo/client/react"
import { Button, Stack, Text } from "@chakra-ui/react"
import { useRouter } from "next/navigation"

interface MessageHeaderWrapper {
  userID: string
  conversationId: string
}

export default function MessageHeader({
  userID,
  conversationId,
}: MessageHeaderWrapper) {
  const router = useRouter()
  const {
    data: conversationData,
    error: conversationError,
    loading: conversationLoading,
  } = useQuery<ConversationDataOutput>(
    conversationCommands.Queries.listConversations
  )

  const conversationName = conversationData?.conversations.find(
    (item) => item.id === conversationId
  )
  // if (
  //   conversationData?.conversations &&
  //   !conversationLoading &&
  //   !conversationName
  // ) {
  //   router.replace(process.env.NEXT_PUBLIC_BASE_URL as string)
  // }
  // console.log("Message header --> ", conversationData)

  return (
    <Stack
      direction="row"
      align="center"
      spacing={6}
      py={5}
      px={4}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Button
        display={{ md: "none" }}
        onClick={() => router.replace("?conversationId" as "/")}
      >
        Back
      </Button>
      {conversationLoading && <>Loading....</>}
      {!conversationData?.conversations && !conversationLoading && (
        <Text>Conversation not found</Text>
      )}
      {conversationName && <Text>{conversationName.name}</Text>}
    </Stack>
  )
}
