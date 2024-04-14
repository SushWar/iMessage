export interface CreateUsernameData {
  createUsername: {
    success: boolean
    error: string
  }
}

export interface CreateUsernameVariable {
  username: string
}

export interface SearchUsersInput {
  id?: String
  username?: String
}

export interface SearchUsersOutput {
  searchUsers?: Array<SearchedUser>
  searchUsersById?: SearchedUser
}

export interface SearchedUser {
  _id: string
  username: string
}

/*
  Conversation
  */

export interface ConversationFetchDetails {
  id: string
  latestMessage: string
  participants: [
    {
      _id: string
      username: string
    }
  ]
  hasSeenLastMessage: [string]
  updatedAt: Date
  name: string
}

export interface ConversationDataOutput {
  conversations: Array<ConversationFetchDetails>
  error: String
  conversationCreated: ConversationFetchDetails
}

export interface ConversationUpdatedSubscription {
  conversationUpdated: {
    conversation: ConversationFetchDetails
  }
}

export interface CreateConversationOutput {
  createConversation: {
    conversationId: string
    error: string
  }
}

export interface CreateConversationInput {
  participants: Array<SearchedUser>
}

/**
 * Messages
 */

export interface MessageFields {
  _id: string
  senderId: { id: string; username: string }
  body: string
  createdAt: string
  conversationId: string
}
export interface MessagesData {
  messages: Array<MessageFields>
}

export interface MessageQueryVarible {
  conversationId: string
}

export interface SendMessageFields {
  conversationId: string
  senderId: { id: string; username: string }
  body: string
}

export interface MessageSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: MessageFields
    }
  }
}
