const typeDefs = `#graphql

  scalar Date
  
   type SearchUser {
    _id: String
    username: String
  }

  type Query {
    searchUsers(username: String!): [SearchUser!]!
    searchUsersById(id:String!):SearchUser!
  }

  type Mutation {
    createUsername(username: String!): CreateUsernameResponse
  }

  type CreateUsernameResponse {
    success: Boolean
    error: String
  }

`

export default typeDefs
