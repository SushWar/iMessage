"use client"
import { Session } from "next-auth"
import ClientLogout from "@/lib/logout/logout"
import { Box, Container } from "@chakra-ui/react"
import ConverstaionList from "./conversationList"
import { useQuery } from "@apollo/client"
import { conversationCommands } from "../../../../graphql/operations/conversation"
import { ConversationDataOutput } from "@/util/type"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

interface Wrapper {
  session: Session
}

export default function ConverstationWrapper({ session }: Wrapper) {
  const router = useRouter()
  const pathname = usePathname()

  const {
    data: conversationData,
    error: conversationError,
    loading: conversationLoading,
    subscribeToMore,
  } = useQuery<ConversationDataOutput>(
    conversationCommands.Queries.listConversations
  )
  // console.log("View Conversation data ", conversationData)
  const subscribeToNewConversations = () => {
    subscribeToMore({
      document:
        conversationCommands.Subscriptions.conversationSubscriptionCreated,
      updateQuery: (prev, { subscriptionData }) => {
        try {
          if (!subscriptionData.data) {
            return prev
          }

          const newConversation = subscriptionData.data.conversationCreated

          return Object.assign({}, prev, {
            conversations: [newConversation, ...prev.conversations],
          })
        } catch (error: any) {
          console.log("INSIDE CONVERSATION WRAPPER ERROR, ", error.message)
          return error
        }
      },
    })
  }

  const onViewConversation = async (conversationId: string) => {
    try {
      router.push(pathname + "?" + `conversationId=${conversationId}`)
    } catch (error: any) {
      console.log(
        "ERROR in onViewConversation in conversation wrapper",
        error.message
      )
    }
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
        onViewConversation={onViewConversation}
      />
      <Container my={4}>
        <ClientLogout />
      </Container>
    </Box>
  )
}
