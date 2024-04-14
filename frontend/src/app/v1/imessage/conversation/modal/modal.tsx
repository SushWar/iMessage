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
} from "@chakra-ui/react"
import { useCallback, useState } from "react"
import { userCommands } from "@/graphql/operations/user"
import { conversationCommands } from "@/graphql/operations/conversation"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import {
  SearchUsersInput,
  SearchUsersOutput,
  SearchedUser,
  CreateConversationOutput,
  CreateConversationInput,
} from "@/util/type"
import UserSearchList from "./userSearchList"
import ParticipantsList from "./participants"
import toast from "react-hot-toast"
import { Session } from "next-auth"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

interface Wrapper {
  isopen: boolean
  onClose: () => void
  session: Session
}

export default function ConversationModal({
  isopen,
  onClose,
  session,
}: Wrapper) {
  const {
    user: { id: sessionId, username: sessionUsername },
  } = session
  const sessionUserData = {
    _id: sessionId,
    username: sessionUsername,
  }
  const router = useRouter()
  const pathname = usePathname()

  const [username, setUsername] = useState("")
  const [participants, setParticipants] = useState<Array<SearchedUser>>([])

  const [searchUsers, { data, error, loading }] = useLazyQuery<
    SearchUsersOutput,
    SearchUsersInput
  >(userCommands.Queries.searchUsers)
  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationOutput, CreateConversationInput>(
      conversationCommands.Mutations.createConversation
    )
  const onCreateConversation = async () => {
    try {
      const participantIds = [
        sessionUserData,
        ...participants.map((p) => {
          return { _id: p._id, username: p.username }
        }),
      ]

      const { data } = await createConversation({
        variables: { participants: participantIds },
      })

      const error = data?.createConversation.error
      if (error) {
        if (error.includes("duplicate")) {
          toast.error("Conversation already exists")
        }
        return
      }
      // console.log("Conversation Modal ", data)
      router.push(
        pathname +
          "?" +
          `conversationId=${data?.createConversation.conversationId}`
      )

      /*
       *Clear state
       */

      setParticipants([])
      setUsername("")
      onClose()
    } catch (error: any) {
      console.log("on createConversation error", error)
      toast.error(error.message)
    }
  }
  const onSearch = async (event: React.FormEvent) => {
    event.preventDefault()
    console.log(username)
    await searchUsers({ variables: { username } })
  }
  const addParticipant = (user: SearchedUser) => {
    if (participants.includes(user)) {
      return
    }
    setParticipants((prev) => [...prev, user])
    setUsername("")
  }

  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((u) => u._id !== userId))
  }

  return (
    <>
      <Modal isOpen={isopen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Create a Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  width="100%"
                  type="submit"
                  isDisabled={!username}
                  isLoading={loading}
                >
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data.searchUsers}
                addParticipant={addParticipant}
              />
            )}
            {participants.length !== 0 && (
              <>
                <ParticipantsList
                  participants={participants}
                  removeParticipants={removeParticipant}
                />
                <Button
                  bg="brand.100"
                  width="100%"
                  mt={6}
                  isLoading={createConversationLoading}
                  onClick={onCreateConversation}
                >
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
