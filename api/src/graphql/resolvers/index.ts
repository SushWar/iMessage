import userResolvers from "./users"
import merge from "lodash.merge"
import conversationResolvers from "./conversation"
const resolvers = merge({}, userResolvers, conversationResolvers)

export default resolvers
