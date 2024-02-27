import mongoose, { Document, Model, Schema } from "mongoose"

const conversationSchema = new mongoose.Schema({
  id: {
    type: Schema.Types.ObjectId,
  },
  participants: {
    type: Array<String>,
  },
  messages: {
    type: Array<String>,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
})

const Conversation = mongoose.model("Conversation", conversationSchema)

export default Conversation
