const typeDefs = `#graphql

    input ParticipantInput {
    _id: String
    username: String
    }
    type Conversation {
        conversationId: String
        # latestMessage: Message
        participants: [String]
        updatedAt: Date
        name:String
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

    type Subscription {
        conversationCreated: Conversation
    }
`

export default typeDefs
