"use client"
import { Session } from "next-auth"
import ClientLogout from "@/lib/logout/logout"
import { Box, Container } from "@chakra-ui/react"
import ConverstaionList from "./conversationList"
import {
  gql,
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client"
import { conversationCommands } from "../../../../graphql/operations/conversation"
import {
  ConversationDataOutput,
  ConversationFetchDetails,
  ConversationUpdatedSubscription,
} from "@/util/type"
import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import SkeletonLoader from "@/lib/components/skeletonLoader"

interface Wrapper {
  session: Session
}

export default function ConverstationWrapper({ session }: Wrapper) {
  const router = useRouter()
  const pathname = usePathname()

  const searchParams = useSearchParams()
  const conversationId = searchParams.get("conversationId")

  const {
    data: conversationData,
    error: conversationError,
    loading: conversationLoading,
    subscribeToMore,
  } = useQuery<ConversationDataOutput>(
    conversationCommands.Queries.listConversations
  )

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { conversationId: string }
  >(conversationCommands.Mutations.markConversationRead)

  const { data, loading } = useSubscription<ConversationUpdatedSubscription>(
    conversationCommands.Subscriptions.conversationUpdated,
    {
      onData: ({ client, data }) => {
        // console.log("FIRSING UPDATE SUBSCRIPTION , ", data)
        const { data: subscriptionData } = data

        if (!subscriptionData) return

        // console.log("IS selected Conversation --> ", conversationId)
        // console.log(
        //   "SUBSCRIPTION UPDATE CONVER ID --> ",
        //   subscriptionData.conversationUpdated.conversation.id
        // )
        if (
          conversationId ===
          subscriptionData.conversationUpdated.conversation.id
        ) {
          markConversationAsReadFunction(conversationId)
        }
      },
    }
  )

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
          // console.log("New Conversation subscription ", newConversation)
          // console.log("Prev Conversation  ", prev)
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

  const markConversationAsReadFunction = async (conversationId: string) => {
    try {
      await markConversationAsRead({
        variables: { conversationId: conversationId },
        optimisticResponse: { markConversationAsRead: true },
        update: (cache) => {
          /**
           * Get conversation participants from cache
           */

          const readFragment = cache.readFragment<ConversationFetchDetails>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                hasSeenLastMessage
              }
            `,
          })
          // console.log("Read Fragment ==> ", readFragment)
          /**
           * update cache
           */
          if (!readFragment?.hasSeenLastMessage) return
          const updateLastSeen = [
            ...readFragment?.hasSeenLastMessage,
            session.user.id,
          ]
          const writeFragment = cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipant on Conversation {
                hasSeenLastMessage
              }
            `,
            data: {
              hasSeenLastMessage: updateLastSeen,
            },
          })

          // console.log("Writing cache ", writeFragment)
        },
      })
    } catch (error: any) {
      console.log(
        "ERROR in onViewConversation in conversation wrapper",
        error.message
      )
    }
  }

  const onViewConversation = async (
    conversationId: string,
    hasSeenLastMessage: boolean
  ) => {
    router.push(pathname + "?" + `conversationId=${conversationId}`)

    if (hasSeenLastMessage) return

    markConversationAsReadFunction(conversationId)
  }

  useEffect(() => {
    subscribeToNewConversations()

    return () => {
      subscribeToNewConversations()
    }
  }, [])

  return (
    <Box
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "400px" }}
      flexDirection="column"
      bg="whiteAlpha.50"
      gap={4}
      py={6}
      px={3}
      position="relative"
    >
      {conversationLoading ? (
        <SkeletonLoader count={7} height="80px" />
      ) : (
        <ConverstaionList
          session={session}
          conversations={conversationData?.conversations || []}
          onViewConversation={onViewConversation}
        />
      )}
      {/* <Container my={4}>
          <ClientLogout />
        </Container> */}
    </Box>
  )
}
