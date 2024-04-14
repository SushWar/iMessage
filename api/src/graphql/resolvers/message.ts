import { withFilter } from "graphql-subscriptions"
import Message from "../../mongodb/models/message"
import {
  GraphQLContext,
  MessageSentSubscriptionPayload,
  SendMessageArgs,
} from "../../util/type"
import { GraphQLError } from "graphql"
import Conversation from "../../mongodb/models/conversation"
import { userIsConversationParticiapnt } from "../../util/function"
import mongoose from "mongoose"

const resolvers = {
  Query: {
    messages: async (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<Array<any>> => {
      const { session, pubsub } = context
      const { conversationId } = args

      if (!session) {
        throw new GraphQLError("Not authorized")
      }
      /**
       * Verfiy the user is a particiapnts
       */

      const searchConversation = await Conversation.findById(conversationId)

      if (!searchConversation || !searchConversation.participants) {
        throw new GraphQLError("Conversation Not Found")
      }

      const isAllow = searchConversation.participants.find((participant) => {
        return participant._id.toString() === session.id
      }) // This need to be shift to function file

      if (!isAllow) {
        throw new GraphQLError("Not authorized to view the conversation")
      }

      try {
        const searchMessage = await Message.find({
          conversationId: conversationId,
        }).sort([["createdAt", "desc"]])

        return searchMessage
      } catch (error: any) {
        console.log("Error in Message query, ", error.message)
        throw new GraphQLError("Message didn't Load")
      }
    },
  },
  Mutation: {
    sendMessage: async (
      _: any,
      args: SendMessageArgs,
      context: GraphQLContext
    ): Promise<boolean> => {
      const { session, pubsub } = context
      const { senderId, conversationId, body } = args

      if (!session || session.id !== senderId.id) {
        throw new GraphQLError("Not authorized")
      }

      try {
        /**
         * new message entity
         */

        const createNewMessage = new Message({
          conversationId: conversationId,
          senderId: senderId,
          body: body,
          hasSeenMessage: [new mongoose.Types.ObjectId(`${session.id}`)],
        })
        createNewMessage.save()

        // console.log("CREATED MESSAGE ==> ", createNewMessage)

        /**
         * update conversation lastMessageId
         */
        const updateConversationFields = await Conversation.findByIdAndUpdate(
          conversationId,
          { lastMessageId: createNewMessage._id, updatedAt: new Date() },
          { new: true }
        )
        const updateConversation = await Conversation.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(conversationId),
            },
          },
          {
            $lookup: {
              from: "messages",
              localField: "lastMessageId",
              foreignField: "_id",
              as: "test",
              pipeline: [
                {
                  $project: {
                    body: 1,
                    _id: 0,
                    hasSeenMessage: 1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "participants",
              foreignField: "_id",
              as: "party",
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
              id: "$_id",
              participants: "$party",
              updatedAt: "$updatedAt",
              name: "$name",
            },
          },
        ])

        // console.log("Update conversation => ", updateConversation)
        // const printUsers = updateConversation[0]
        // console.log("SHow new message --> ", createNewMessage)
        pubsub.publish("MESSAGE_SENT", { messageSent: createNewMessage })

        pubsub.publish("CONVERSATION_UPDATED", {
          conversationUpdated: { conversation: updateConversation[0] },
        })

        return true
      } catch (error: any) {
        console.log("Message mutation error, ", error.message)
        throw new GraphQLError("Error sending message")
      }
    },
  },
  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context
          return pubsub.asyncIterator(["MESSAGE_SENT"])
        },
        (
          payload: MessageSentSubscriptionPayload,
          args: { conversationId: string },
          context: GraphQLContext
        ) => {
          // console.log("Payload data message sent subscription--> ", payload)
          // console.log(
          //   "Inside message sent subsciption data --> ",
          //   args.conversationId
          // )
          console.log(
            `TRUE / FALSE --> ${payload.messageSent.conversationId} || ${args.conversationId}`,
            payload.messageSent.conversationId === args.conversationId
          )
          return payload.messageSent.conversationId === args.conversationId
        }
      ),
    },
  },
}

export default resolvers
