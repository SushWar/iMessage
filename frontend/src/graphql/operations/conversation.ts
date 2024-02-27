import { gql } from "@apollo/client"

export const conversationCommands = {
  Queries: {
    listConversations: gql`
      query Conversations {
        conversations {
          conversationId
          participants
          updatedAt
        }
        error
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantIds: [String]!) {
        createConversation(participantIds: $participantIds) {
          conversationId
          error
        }
      }
    `,
  },
  Subscriptions: {
    conversationSubscriptionCreated: gql`
      subscription ConversationCreated {
        conversationCreated {
          conversationId
          participants
          updatedAt
        }
      }
    `,
  },
}
