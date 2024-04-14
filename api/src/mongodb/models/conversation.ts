import mongoose, { Document, Model, Schema } from "mongoose"

const conversationSchema = new mongoose.Schema({
  // id: {
  //   type: Schema.Types.ObjectId,
  // },
  participants: [Schema.Types.ObjectId],
  name: {
    type: String,
    default: "",
  },
  lastMessageId: {
    type: Schema.Types.ObjectId,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

const Conversation = mongoose.model("Conversation", conversationSchema)

export default Conversation
