import User from "../../mongodb/models/user"
import {
  CreateUsernameResponse,
  GraphQLContext,
  SearchUsernameResposne,
} from "../../util/type"

const resolvers = {
  Query: {
    searchUsers: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<Array<any> | null> => {
      const { session } = context
      // console.log(args.username)
      if (!session) {
        console.log("inside false")
        // return { error: "Not authorized" }
        return null
      }
      // console.log("inside true")
      const { username: myUsername } = session

      try {
        const users = await User.find({
          $or: [
            {
              username: {
                $ne: myUsername,
                $regex: `^${args.username}`,
                $options: "i",
              },
            },
            // { username: { $ne: myUsername } },
          ],
        })

        // console.log(users)
        // return { username: users }
        return users
      } catch (error: any) {
        console.log("SerchUser query error", error)
        // return { error: error.message }
        return null
      }
    },
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      console.log("1")
      if (!context.session) {
        console.log("2")

        return { error: "Not authorized" }
      }
      console.log("3")
      console.log("the context is :- ", context)
      try {
        console.log("4")
        const duplicate = await User.findOne({ username: args.username })
        console.log("5")
        if (duplicate) {
          console.log("6")
          return { error: "Username already exists" }
        }
        console.log("7")
        const val = await User.updateOne(
          { _id: context.session.id },
          { username: args.username, onboarding: true }
        )
        console.log("8")
        console.log(val)
        if (val) {
          console.log("9")
          return { success: true }
        }
        console.log("10")
        return { error: "Internal error" }
      } catch (error: any) {
        console.log("11")
        console.log(error)
        return { error: error.message }
      }
    },
  },
}

export default resolvers
