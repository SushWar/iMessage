import mongoose, { Document, Model, Schema } from "mongoose"

const messageSchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
  },
  conversationId: {
    type: String,
  },
  senderId: {
    type: String,
  },
  body: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
})

const Message = mongoose.model("Message", messageSchema)

export default Message
