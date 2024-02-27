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
  username: String
}

export interface SearchUsersOutput {
  searchUsers: Array<SearchedUser>
}

export interface SearchedUser {
  _id: string
  username: string
}

/*
  Conversation
*/

export interface ConversationDataOutput {
  conversations: Array<any>
  error: String
  conversationCreated: any
}

export interface CreateConversationOutput {
  createConversation: {
    conversationId: string
    error: string
  }
}

export interface CreateConversationInput {
  participantIds: Array<string>
}
