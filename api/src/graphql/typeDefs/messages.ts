const typeDefs = `#graphql

    type Message {
        _id: String
        senderId: SearchUser
        body: String
        createdAt: Date
    }
`

export default typeDefs
