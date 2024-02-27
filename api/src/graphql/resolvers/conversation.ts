import { withFilter } from "graphql-subscriptions"
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
      /*
       * withFilter will help us not to update every users subscription comment.
       * 2 returns, the 2nd return return boolean which decide wheather to exceute 1st one or not
       */
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context
          return pubsub.asyncIterator(["CONVERSATION_CREATED"])
        },
        (
          payload: ConversationCreateSubscriptionPayload,
          _,
          context: GraphQLContextSubscription
        ) => {
          const {
            session: { user },
          } = context
          const {
            conversationCreated: { participants },
          } = payload

          const isParticipant = !!participants.find((p) => {
            console.log("Participants array --> ", p)
            return p === user?.id
          })
          console.log(isParticipant)
          return isParticipant
        }
      ),
    },
  },
}

export interface ConversationCreateSubscriptionPayload {
  conversationCreated: {
    conversationId: String
    participants: [String]
    updatedAt: Date
  }
}

export interface GraphQLContextSubscription {
  session: {
    user: {
      id: String
      name: String
      onboarding: Boolean
      username: String
    }
    expires: String
  }
}

export default resolvers
