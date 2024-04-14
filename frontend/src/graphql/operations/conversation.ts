import { gql } from "@apollo/client"

export const conversationCommands = {
  Queries: {
    listConversations: gql`
      query Conversations {
        conversations {
          id
          latestMessage
          participants {
            _id
            username
          }
          hasSeenLastMessage
          updatedAt
          name
        }
        error
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participants: [ParticipantInput!]!) {
        createConversation(participants: $participants) {
          conversationId
          error
        }
      }
    `,
    markConversationRead: gql`
      mutation MarkConversation($conversationId: String!) {
        markConversationAsRead(conversationId: $conversationId)
      }
    `,
  },
  Subscriptions: {
    conversationSubscriptionCreated: gql`
      subscription ConversationCreated {
        conversationCreated {
          id
          latestMessage
          participants {
            _id
            username
          }
          hasSeenLastMessage
          updatedAt
          name
        }
      }
    `,

    conversationUpdated: gql`
      subscription ConversationUpdated {
        conversationUpdated {
          conversation {
            id
            latestMessage
            participants {
              _id
              username
            }
            hasSeenLastMessage
            updatedAt
            name
          }
        }
      }
    `,
  },
}
