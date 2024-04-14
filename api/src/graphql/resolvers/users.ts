import { GraphQLError } from "graphql"
import User from "../../mongodb/models/user"
import { CreateUsernameResponse, GraphQLContext } from "../../util/type"

const resolvers = {
  Query: {
    searchUsers: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<Array<typeof User>> => {
      const { session } = context
      if (!session) {
        throw new GraphQLError("Not authorized")
      }

      const { username: myUsername } = session

      try {
        const users = (await User.find({
          $or: [
            {
              username: {
                $ne: myUsername,
                $regex: `^${args.username}`,
                $options: "i",
              },
            },
          ],
        })) as Array<typeof User>

        return users
      } catch (error: any) {
        console.log("SerchUser query error", error)

        throw new GraphQLError(error.message)
      }
    },

    // searchUsersById: async (
    //   _: any,
    //   args: { id: string },
    //   context: GraphQLContext
    // ): Promise<any | null> => {
    //   const { id } = args
    //   const { session } = context
    //   if (!session) {
    //     console.log("inside false")

    //     return null
    //   }
    //   console.log("INSIDE searchUserByID --> ", id)
    //   try {
    //     const users = await User.findById(id)

    //     return users
    //   } catch (error: any) {
    //     console.log("SerchUserById query error", error)

    //     return null
    //   }
    // },
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { session } = context
      if (!session) {
        throw new GraphQLError("Not authorized")
      }
      try {
        // const duplicate = await User.findOne({ username: args.username })

        // if (duplicate) {
        //   return { error: "Username already exists" }
        //   throw new GraphQLError("Username")
        // }

        const val = await User.updateOne(
          { _id: session.id },
          { username: args.username, onboarding: true }
        )

        if (val.acknowledged && val.matchedCount == 1) {
          return { success: true }
        }
        throw new GraphQLError("Onboarding Unsuccessfull")
      } catch (error: any) {
        // return { error: error.message }
        throw new GraphQLError(error.message)
      }
    },
  },
}

export default resolvers
