import { SearchUsersOutput, SearchedUser } from "../../../../../util/type"
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  Input,
  Button,
  Flex,
  Avatar,
} from "@chakra-ui/react"
interface UserSearchListProps {
  users: Array<SearchedUser>
  addParticipant: (user: SearchedUser) => void
}

export default function UserSearchList({
  users,
  addParticipant,
}: UserSearchListProps) {
  return (
    <>
      {users.length === 0 ? (
        <Flex mt={6} justify={"center"}>
          <Text>No Users found</Text>
        </Flex>
      ) : (
        <Stack mt={6}>
          {users.map((user, key) => {
            return (
              <Stack
                key={key}
                direction="row"
                align="center"
                spacing={4}
                py={2}
                px={4}
                borderRadius={4}
                _hover={{ bg: "whiteAlpha.200" }}
                cursor="pointer"
              >
                <Avatar />
                <Flex justify="space-between" align="center" width="100%">
                  <Text color="whiteAlpha.700">{user.username}</Text>
                  <Button bg="brand.100" onClick={() => addParticipant(user)}>
                    Select
                  </Button>
                </Flex>
              </Stack>
            )
          })}
        </Stack>
      )}
    </>
  )
}
