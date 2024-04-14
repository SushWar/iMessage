const typeDefs = `#graphql

    type SendIdUserData{
        id:String
        username:String
    }
    type Message {
        _id: String
        senderId: SendIdUserData
        body: String
        createdAt: Date
        conversationId:String
    }

    input SendIdUser {
        id:String
        username:String
    }

    type Query {
        messages(conversationId: String):[Message!]
    }

    type Mutation {
        sendMessage(conversationId: String, senderId: SendIdUser, body:String):Boolean
    }

    type Subscription {
        messageSent(conversationId: String): Message
    }
`

export default typeDefs
