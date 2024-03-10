import { gql } from "@apollo/client"

export const userCommands = {
  Queries: {
    searchUsers: gql`
      query SearchUsers($username: String!) {
        searchUsers(username: $username) {
          _id
          username
        }
      }
    `,
    searchUserById: gql`
      query SearchUsersById($id: String!) {
        searchUsersById(id: $id) {
          _id
          username
        }
      }
    `,
  },
  Mutations: {
    createUsername: gql`
      mutation CreateUsername($username: String!) {
        createUsername(username: $username) {
          success
          error
        }
      }
    `,
  },
  Subscriptions: {},
}
