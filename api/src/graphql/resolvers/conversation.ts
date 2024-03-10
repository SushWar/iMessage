import { withFilter } from "graphql-subscriptions"
import Conversation from "../../mongodb/models/conversation"
import User from "../../mongodb/models/user"
import { GraphQLContext, SearchUsersData } from "../../util/type"
import mongoose, { Schema } from "mongoose"
import { defaultName } from "../../util/function"

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
              _id: 0,
              conversationId: "$conversations",
              participants: "$result.participants",
              updatedAt: "$result.updatedAt",
              name: "$result.name",
            },
          },
        ])
        // console.log("Inside search Conversation ", conversation)
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
      args: { participants: Array<SearchUsersData> },
      context: GraphQLContext
    ): Promise<{ conversationId?: Object; error?: string }> => {
      const { session, pubsub } = context
      const { participants } = args
      if (!session) {
        console.log("inside false")
        return { error: "Not authorized" }
      }
      // console.log("Inside Create Conversation", participants)

      // console.log(
      //   "Testing fetch Username --> ",
      //   defaultName(participants, session?.id)
      // )

      try {
        const conversationName = defaultName(participants, session.id)
        const participantIds = participants.map((p) => p._id)
        console.log("particpants id testing ", participantIds)
        const conversation = new Conversation({
          participants: participantIds,
          name: conversationName,
        })

        await conversation.save()

        for (let i = 0; i < participants.length; i++) {
          await User.findByIdAndUpdate(participants[i]._id, {
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

      // return { conversationId: "Testing" }
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
