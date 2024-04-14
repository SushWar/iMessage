import { withFilter } from "graphql-subscriptions"
import Conversation from "../../mongodb/models/conversation"
import User from "../../mongodb/models/user"
import { GraphQLContext, SearchUsersData } from "../../util/type"
import mongoose, { ObjectId, Schema } from "mongoose"
import { defaultName } from "../../util/function"
import Message from "../../mongodb/models/message"
import { GraphQLError } from "graphql"

const resolvers = {
  Query: {
    conversations: async (
      _: any,
      args: any,
      context: GraphQLContext
    ): Promise<Array<any> | { error: String }> => {
      const { session } = context

      if (!session) {
        throw new GraphQLError("Not authorized")
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
            $lookup: {
              from: "messages",
              localField: "result.lastMessageId",
              foreignField: "_id",
              as: "test",
              pipeline: [{ $project: { body: 1, _id: 0, hasSeenMessage: 1 } }],
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "result.participants",
              foreignField: "_id",
              as: "participants",
              pipeline: [{ $project: { username: 1 } }],
            },
          },
          {
            $project: {
              _id: 0,
              latestMessage: { $first: "$test.body" },
              hasSeenLastMessage: {
                $first: "$test.hasSeenMessage",
              },
              id: "$conversations",
              participants: "$participants",
              updatedAt: "$result.updatedAt",
              name: "$result.name",
            },
          },
          {
            $sort: {
              updatedAt: -1,
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
        throw new GraphQLError("Not authorized")
      }

      try {
        const participantIds = participants.map(
          (p) => new mongoose.Types.ObjectId(p._id)
        )

        const conversation = new Conversation({
          participants: participantIds,
        })

        await conversation.save()

        const sender = { id: session.id, username: session.username }

        const createNewMessage = new Message({
          conversationId: conversation._id,
          senderId: sender,
          body: "",
          hasSeenMessage: [new mongoose.Types.ObjectId(`${session.id}`)],
        })
        createNewMessage.save()

        await Conversation.findOneAndUpdate(conversation._id, {
          lastMessageId: createNewMessage._id,
        })

        for (let i = 0; i < participants.length; i++) {
          await User.findByIdAndUpdate(participants[i]._id, {
            $push: { conversations: conversation._id },
          })
        }

        const conversationAggregate = await Conversation.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(`${conversation._id}`),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "participants",
              foreignField: "_id",
              as: "result",
              pipeline: [{ $project: { username: 1 } }],
            },
          },
          {
            $project: {
              createdAt: 0,
              participants: 0,
              __v: 0,
            },
          },
        ])

        pubsub.publish("CONVERSATION_CREATED", {
          conversationCreated: {
            id: conversationAggregate[0]._id,
            latestMessage: "",
            participants: conversationAggregate[0].result,
            hasSeenLastMessage: createNewMessage.hasSeenMessage,
            updatedAt: conversationAggregate[0].updatedAt,
            name: conversationAggregate[0].name,
          },
        })
        return { conversationId: conversation._id }
      } catch (error: any) {
        console.log("Inside create conversation error", error)
        return { error: error.message }
      }
    },
    markConversationAsRead: async (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<boolean> => {
      const { session } = context
      const { conversationId } = args

      if (!session) {
        throw new GraphQLError("Not authorized")
      }

      const userObjectId = new mongoose.Types.ObjectId(`${session.id}`)

      try {
        const updateLastSeen = await Message.updateMany(
          { conversationId: conversationId },
          { $addToSet: { hasSeenMessage: userObjectId } }
        )

        // console.log(updateLastSeen)
        return true
      } catch (error: any) {
        console.log("Mark conversation read error ", error)
        throw new GraphQLError(error.message)
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
          console.log("session in sub create Conver==> ", context.session)
          const {
            session: { user },
          } = context
          if (!user) {
            throw new GraphQLError("Not authorized")
          }
          const {
            conversationCreated: { participants },
          } = payload
          const isParticipant = !!participants.find((p) => {
            return p._id.toString() === user.id
          })
          return isParticipant
        }
      ),
    },
    conversationUpdated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context
          return pubsub.asyncIterator(["CONVERSATION_UPDATED"])
        },
        (
          payload: ConversationUpdatedSubscriptionPayload,
          _,
          context: GraphQLContextSubscription
        ) => {
          // console.log("session in sub converUpdate==> ", context.session)
          const {
            session: { user },
          } = context
          if (!user) {
            throw new GraphQLError("Not authorized")
          }
          const {
            conversationUpdated: {
              conversation: { participants },
            },
          } = payload
          // console.log(
          //   "Here is the payLoad from subscription updated => ",
          //   payload.conversationUpdated.conversation.participants
          // )
          const isParticipant = !!participants.find((p) => {
            return p._id.toString() === user.id
          })
          return isParticipant
          // return true
        }
      ),
    },
  },
}

export interface ConversationCreateSubscriptionPayload {
  conversationCreated: {
    id: String
    participants: [{ _id: mongoose.Types.ObjectId; username: String }]
    updatedAt: Date
    name: String
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

export interface ConversationUpdatedSubscriptionPayload {
  conversationUpdated: {
    conversation: {
      id: String
      participants: [{ _id: mongoose.Types.ObjectId; username: String }]
      updatedAt: Date
      name: String
    }
  }
}

export default resolvers
