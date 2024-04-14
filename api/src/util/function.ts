import { SearchUsersData } from "./type"

const defaultName = (item: Array<SearchUsersData>, exclude: String): string => {
  const usernames = item
    .filter((participant) => participant._id != exclude)
    .map((participant) => participant.username)

  return usernames.join(", ")
}

const userIsConversationParticiapnt = (
  particiapnts: Array<string> | null,
  userId: string
): boolean => {
  if (particiapnts === null) {
    return false
  }
  return !!particiapnts.find((participant) => participant === userId)
}

export { defaultName, userIsConversationParticiapnt }
