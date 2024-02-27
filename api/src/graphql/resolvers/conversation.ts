import Conversation from "../../mongodb/models/conversation"
import User from "../../mongodb/models/user"
import { GraphQLContext } from "../../util/type"
import mongoose, { Schema } from "mongoose"

const resolvers = {
  Query: {
    conversations: async (
      _: any,
      args: any,
      context: GraphQLContext
    ): Promise<Array<any> | { error: String }> => {
      const { session } = context

      if (!session) {
        return { error: "Not authorized" }
      }

      try {
        const conversation = await User.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(`${session.id}`),
            },
          },
          { $unwind: "$conversations" },
          {
            $lookup: {
              from: "conversations",
              localField: "conversations",
              foreignField: "_id",
              as: "result",
            },
          },
          { $unwind: "$result" },
          {
            $project: {
              conversationId: "$conversations",
              participants: "$result.participants",
              updatedAt: "$result.updatedAt",
            },
          },
        ])
        return conversation
      } catch (error: any) {
        console.log("Inside conversation query error", error.message)
        return { error: error.message }
      }
    },
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext
    ): Promise<{ conversationId?: Object; error?: string }> => {
      const { session, pubsub } = context
      const { participantIds } = args
      // console.log("Inside Create Conversation", args.participantIds)
      if (!session) {
        console.log("inside false")
        return { error: "Not authorized" }
      }

      try {
        const conversation = new Conversation({
          participants: participantIds,
        })

        await conversation.save()

        for (let i = 0; i < participantIds.length; i++) {
          await User.findByIdAndUpdate(participantIds[i], {
            $push: { conversations: conversation._id },
          })
        }

        pubsub.publish("CONVERSATION_CREATED", {
          conversationCreated: {
            conversationId: conversation._id,
            participants: conversation.participants,
            updatedAt: conversation.updatedAt,
          },
        })
        return { conversationId: conversation._id }
      } catch (error: any) {
        console.log("Inside create conversation error", error)
        return { error: error.message }
      }
    },
  },

  Subscription: {
    conversationCreated: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        const { pubsub } = context
        // console.log("Inside conversation subscription")
        return pubsub.asyncIterator(["CONVERSATION_CREATED"])
      },
    },
  },
}

export default resolvers
