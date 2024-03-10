// import {Session} from 'next-auth'
import { PubSub } from "graphql-subscriptions"
import { Context } from "graphql-ws/lib/server"

// Server config

export interface GraphQLContext {
  session: Session | null
  pubsub: PubSub
}

export interface Session {
  // user?: User
  name: String
  email: String
  id: String
  emailVerified: boolean
  onboarding: boolean
  username: string
  iat: Number
  exp: Number
  jti: String
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session
  }
}

// User config
export interface CreateUsernameResponse {
  success?: boolean
  error?: string
}

//Not in use
// export interface SearchUsernameResposne {
//   Users?: Array<SearchUsersData>
//   error?: string
// }

export interface SearchUsersData {
  _id: string
  username: string
}
