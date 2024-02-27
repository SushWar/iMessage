const typeDefs = `#graphql

    type Conversation {
        conversationId: String
        # latestMessage: Message
        participants: [String]
        updatedAt: Date
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
        createConversation(participantIds: [String]): CreateConversationResponse
    }

    type Subscription {
        conversationCreated: Conversation
    }
`

export default typeDefs
