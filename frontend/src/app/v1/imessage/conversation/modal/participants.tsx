import { SearchedUser } from "../../../../../util/type"
import { Flex, Text, Stack } from "@chakra-ui/react"
import { IoIosCloseCircleOutline } from "react-icons/io"
interface ParticipantsProps {
  participants: Array<SearchedUser>
  removeParticipants: (userId: string) => void
}

export default function ParticipantsList({
  participants,
  removeParticipants,
}: ParticipantsProps) {
  return (
    <Flex mt={8} gap="10px" flexWrap="wrap">
      {participants.map((particpant, key) => {
        return (
          <Stack
            key={key}
            direction="row"
            align="center"
            bg="whiteAlpha.200"
            borderRadius={4}
            p={2}
          >
            <Text>{particpant.username}</Text>
            <IoIosCloseCircleOutline
              size={20}
              cursor="pointer"
              onClick={() => removeParticipants(particpant._id)}
            />
          </Stack>
        )
      })}
    </Flex>
  )
}
