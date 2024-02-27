"use client"
import { Session } from "next-auth"
import ClientLogout from "@/lib/logout/logout"
import { Box } from "@chakra-ui/react"
import ConverstaionList from "./conversationList"
import { useQuery } from "@apollo/client"
import { conversationCommands } from "../../../../graphql/operations/conversation"
import { ConversationDataOutput } from "@/util/type"
import { useEffect } from "react"

interface Wrapper {
  session: Session
}

export default function ConverstationWrapper({ session }: Wrapper) {
  const {
    data: conversationData,
    error: conversationError,
    loading: conversationLoading,
    subscribeToMore,
  } = useQuery<ConversationDataOutput>(
    conversationCommands.Queries.listConversations
  )
  // console.log(
  //   "INSIDE conversation wrapper QUERY DATA -- ",
  //   conversationData?.conversations
  // )

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document:
        conversationCommands.Subscriptions.conversationSubscriptionCreated,
      updateQuery: (prev, { subscriptionData }) => {
        try {
          // console.log(
          //   "INSIDE conversation wrapper HERE IS PREV Data ",
          //   prev.conversations
          // )
          // console.log("Subscription 1")
          // console.log(
          //   "INSIDE conversation wrapper HERE IS SUBSCRIPTION DATA",
          //   subscriptionData.data.conversationCreated
          // )
          if (!subscriptionData.data) {
            return prev
          }
          // console.log("Subscription 2")
          const newConversation = subscriptionData.data.conversationCreated
          // console.log("Subscription 3")
          return Object.assign({}, prev, {
            conversations: [newConversation, ...prev.conversations],
          })
        } catch (error: any) {
          // console.log("Subscription 4")
          console.log("INSIDE CONVERSATION WRAPPER ERROR, ", error.message)
          return error
        }
      },
    })
  }

  useEffect(() => {
    subscribeToNewConversations()

    return () => {
      subscribeToNewConversations()
    }
  }, [])

  return (
    <Box width={{ base: "100%", md: "400px" }} bg="whiteAlpha.50" py={6} px={3}>
      <ConverstaionList
        session={session}
        conversations={conversationData?.conversations || []}
      />
      <div className=" py-4">
        <ClientLogout />
      </div>
    </Box>
  )
}
