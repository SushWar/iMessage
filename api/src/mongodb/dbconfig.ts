import mongoose from "mongoose"

export async function connect() {
  try {
    mongoose.connect(process.env.MONGODB_URI!)
    const connect = mongoose.connection
    connect.on("connected", () => {
      console.log("MongoDB connected successfuly")
    })

    connect.on("error", (err) => {
      console.log("Please check your connection" + err)
      process.exit()
    })
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
  }
}

export async function disconnect() {
  try {
    await mongoose.disconnect()
  } catch (error) {
    console.error("Error disconnecting to MongoDB:", error)
  }
}
