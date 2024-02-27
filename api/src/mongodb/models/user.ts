import mongoose, { Document, Model, Schema } from "mongoose"

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  emailVerified: {
    type: Date,
  },
  image: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  onboarding: {
    type: Boolean,
  },
  accounts: {
    type: Array<String>,
  },
  sessions: {
    type: Array<String>,
  },
  conversations: {
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

// const User = mongoose.models.user || mongoose.model("User", userSchema)
const User = mongoose.model("user", userSchema)

export default User
