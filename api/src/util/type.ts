// import {Session} from 'next-auth'
import { PubSub } from "graphql-subscriptions"
import { Context } from "graphql-ws/lib/server"
import Message, { messageSchema } from "../mongodb/models/message"

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

// User Types
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

/**
 * Messages
 */

export interface SendMessageArgs {
  conversationId: string
  senderId: { id: string; username: string }
  body: string
}

export interface MessageSentSubscriptionPayload {
  messageSent: {
    _id: string
    conversationId: string
    senderId: string
    body: string
    hasSeenMessage: Array<string>
    createdAt: Date
    updatedAt: Date
  }
}

/**
 * Conversation
 */

export interface ConversationSchema {
  _id: string
  participants: Array<string>
  messages: any
  name: string
  lastMessageId: string
  createdAt: Date
  updatedAt: Date
}
