import { SearchUsersData } from "./type"

const defaultName = (item: Array<SearchUsersData>, exclude: String): String => {
  const usernames = item
    .filter((participant) => participant._id != exclude)
    .map((participant) => participant.username)

  return usernames.join(", ")
}

export { defaultName }
