import { gql } from "@apollo/client"

export const MessageFields = `
         _id
          senderId {
                id
                username
              }
          body
          createdAt
          conversationId
`

export const messagesCommands = {
  Queries: {
    messages: gql`
      query Messages($conversationId: String) {
        messages(conversationId: $conversationId) {
         ${MessageFields}
        }
      }
    `,
  },
  Mutation: {
    sendMessage: gql`
      mutation SendMessage(
        $conversationId: String!
        $senderId: SendIdUser!
        $body: String!
      ) {
        sendMessage(
          conversationId: $conversationId
          senderId: $senderId
          body: $body
        )
      }
    `,
  },
  Subscription: {
    messageSent: gql`
        subscription MessageSent($conversationId: String!){
            messageSent(conversationId: $conversationId){
                ${MessageFields}
            } 
        }
    `,
  },
}
