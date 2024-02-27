// const accountSchema = new mongoose.Schema({
//   id: {
//     type: mongoose.Schema.Types.ObjectId,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
//   type: {
//     type: String,
//     unique: true,
//   },
//   provider: {
//     type: Date,
//   },
//   providerAccountId: {
//     type: String,
//   },
//   refresh_token: {
//     type: String,
//   },
//   access_token: {
//     type: String,
//   },
//   expires_at: {
//     type: Number,
//   },
//   token_type: {
//     type: String,
//   },
//   scope: {
//     type: String,
//   },
//   id_token: {
//     type: String,
//   },
//   session_state: {
//     type: String,
//   },
// })

// const Account = mongoose.models.accounts // mongoose.model("Account", accountSchema)

// const sessionSchema = new mongoose.Schema({
//   id: {
//     type: mongoose.Schema.Types.ObjectId,
//   },
//   sessionToken: {
//     type: String,
//     unique: true,
//   },
//   userId: {
//     type: String,
//   },
//   expires: {
//     type: Date,
//   },
//   image: {
//     type: String,
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
// })

// const Session = mongoose.models.sessions //mongoose.model("Session", sessionSchema)
