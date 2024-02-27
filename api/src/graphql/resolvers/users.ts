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
      if (!context.session) {
        return { error: "Not authorized" }
      }

      console.log("the context is :- ", context)
      try {
        const duplicate = await User.findOne({ username: args.username })

        if (duplicate) {
          return { error: "Username already exists" }
        }

        const val = await User.updateOne(
          { _id: context.session.id },
          { username: args.username, onboarding: true }
        )

        if (val) {
          return { success: true }
        }

        return { error: "Internal error" }
      } catch (error: any) {
        return { error: error.message }
      }
    },
  },
}

export default resolvers
