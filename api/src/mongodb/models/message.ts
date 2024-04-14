import mongoose, { Document, Model, Schema } from "mongoose"

export const messageSchema = new mongoose.Schema({
  // id: {
  //   type: Schema.Types.ObjectId,
  // },
  conversationId: {
    type: String,
  },
  senderId: {
    id: String,
    username: String,
  },
  body: {
    type: String,
  },
  hasSeenMessage: [Schema.Types.ObjectId],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

const Message = mongoose.model("Message", messageSchema)

export default Message
