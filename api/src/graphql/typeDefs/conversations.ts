const typeDefs = `#graphql

    input ParticipantInput {
    _id: String
    username: String
    }
    type ParticipantOutput {
    _id: String
    username: String
    }

    type Conversation {
        id: String
        latestMessage: String
        participants: [ParticipantOutput]
        hasSeenLastMessage:[String]
        updatedAt: Date
        name:String
    }

    type ConversationUpdatedSubscription{
        conversation: Conversation
    }

     type Participant {
        id: String
        user: SearchUser
        hasSeenLatestMessage: Boolean
    }
    type Query{
        conversations:[Conversation]
        error:String
    }

    type CreateConversationResponse{
        conversationId: String
        error: String
    }

    type Mutation {
        createConversation(participants: [ParticipantInput!]!): CreateConversationResponse
    }

    type Mutation {
        markConversationAsRead(conversationId:String!): Boolean
    }

    type Subscription {
        conversationCreated: Conversation
    }

    type Subscription {
        conversationUpdated: ConversationUpdatedSubscription
    }
`

export default typeDefs
