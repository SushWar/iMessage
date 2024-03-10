import { gql } from "@apollo/client"

export const conversationCommands = {
  Queries: {
    listConversations: gql`
      query Conversations {
        conversations {
          conversationId
          participants
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
