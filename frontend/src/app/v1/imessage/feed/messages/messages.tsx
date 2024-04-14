import { messagesCommands } from "@/graphql/operations/message"
import SkeletonLoader from "@/lib/components/skeletonLoader"
import {
  MessageQueryVarible,
  MessageSubscriptionData,
  MessagesData,
} from "@/util/type"
import { useQuery } from "@apollo/client"
import { Flex, Stack } from "@chakra-ui/react"
import { useEffect } from "react"
import toast from "react-hot-toast"
import MessageItem from "./messageItem"
import { useSearchParams } from "next/navigation"

interface ConversationMessagesInterface {
  userId: string
  conversationId: string
}

export default function ConversationMessages({
  conversationId,
  userId,
}: ConversationMessagesInterface) {
  // console.log("Inside Message --> ", conversationId)

  const { data, loading, error, subscribeToMore } = useQuery<
    MessagesData,
    MessageQueryVarible
  >(messagesCommands.Queries.messages, {
    variables: { conversationId },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
  // console.log("Here is the message -->", data?.messages)

  const subscribeToMoreMessage = (conversationId: string) => {
    subscribeToMore({
      document: messagesCommands.Subscription.messageSent,
      variables: {
        conversationId: conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
        if (
          !subscriptionData.data ||
          subscriptionData.data.messageSent.conversationId !== conversationId
        ) {
          return prev
        }

        const newMessage = subscriptionData.data.messageSent
        console.log("Message subcription ---> prev ", prev)
        console.log("Message subcription ---> curr ", subscriptionData)
        return Object.assign({}, prev, {
          messages: [newMessage, ...prev.messages],
        })
      },
    })
  }

  useEffect(() => {
    subscribeToMoreMessage(conversationId)

    return () => {
      subscribeToMoreMessage(conversationId)
    }
  }, [conversationId])

  if (error) {
    return null
  }

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={7} height="60px" />
        </Stack>
      )}
      {data?.messages && (
        <Flex direction="column-reverse" overflowY="auto" height="100%">
          {data.messages.map((item, idx) => {
            return (
              <MessageItem
                key={idx}
                message={item}
                sendByMe={item.senderId.id === userId}
                conversationId={conversationId}
              />
            )
          })}
        </Flex>
      )}
    </Flex>
  )
}
