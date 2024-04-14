import { messagesCommands } from "@/graphql/operations/message"
import { SendMessageFields } from "@/util/type"
import { useMutation } from "@apollo/client"
import { Box, Input } from "@chakra-ui/react"
import { Session } from "next-auth"
import { useState } from "react"
import toast from "react-hot-toast"

interface MessageInputWrapper {
  session: Session
  conversationId: string
}

export default function MessageInput({
  session,
  conversationId,
}: MessageInputWrapper) {
  const [messageBody, setMessageBody] = useState("")
  const [sendMessage] = useMutation<
    { sendMessage: boolean },
    SendMessageFields
  >(messagesCommands.Mutation.sendMessage)

  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const {
        user: { id: senderId, username: senderUsername },
      } = session

      const newMessage: SendMessageFields = {
        conversationId: conversationId,
        senderId: { id: senderId, username: senderUsername },
        body: messageBody,
      }

      const { data, errors } = await sendMessage({
        variables: { ...newMessage },
        // optimisticResponse:{
        //   sendMessage:true,
        // },
        // update: (cache)=>{
        //   const existing = cache.readQuery({query:messagesCommands.Queries.messages,
        //   variables:{conversationId}
        // })
        // cache.writeQuery({
        //   query:messagesCommands.Queries.messages,
        //   variables:{conversationId},
        //   data:{
        //     ...existing,
        //     messages:[id:]
        // })
        // }
      })

      if (!data?.sendMessage || errors) {
        throw new Error("failed to send message")
      }

      setMessageBody("")
    } catch (error: any) {
      console.log("OnsendMessage error", error.message)
      toast.error(error.message)
    }
  }

  return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={onSendMessage}>
        <Input
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          placeholder="New message"
          size="md"
          resize="none"
          _focus={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: "whiteAlpha.300",
          }}
        />
      </form>
    </Box>
  )
}
