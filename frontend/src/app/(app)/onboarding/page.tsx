"use client"
import { useMutation } from "@apollo/client"
import { Center, Stack, Text, Input, Button } from "@chakra-ui/react"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { userCommands } from "../../../graphql/operations/user"
import { CreateUsernameData, CreateUsernameVariable } from "@/util/type"
import { useSession } from "next-auth/react"
import axios from "axios"
import Loader from "@/lib/components/loader"

export default function Boarding() {
  const session = useSession()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [loader, setLoader] = useState(true)
  const [createUsername, { data, loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariable
  >(userCommands.Mutations.createUsername)
  const onSubmit = async () => {
    if (!username) return
    try {
      const { data } = await createUsername({ variables: { username } })
      if (data?.createUsername.error) {
        toast.error(data?.createUsername.error)
      } else if (data?.createUsername.success) {
        toast.success("Username Successfully created")
        const response = await axios.post("/api/cookie/deleteCookie", {
          name: "clientBoardToken",
        })
        router.push("/v1/imessage")
      } else {
        toast.error("There was an error")
      }
    } catch (error) {
      toast.error("There was an error")
      console.log("onSubmit error, " + error)
    }
  }

  const checkAction = async () => {
    console.log(
      "Inside Boarding page. Session expiry :- ",
      session.data?.expires
    )
    try {
      if (session.data && session.status === "authenticated") {
        if (session.data.user.onboarding === true) {
          router.push("/v1/imessage")
        } else {
          const response = await axios.post("/api/cookie/setCookie", {
            name: "clientBoardToken",
          })

          setLoader(false)
        }
      } else {
        redirect(`/auth/login`)
      }
    } catch (error: any) {
      console.log("Error is Boarding, checkAction, ", error.message)
    }
  }

  useEffect(() => {
    checkAction()

    return () => {
      checkAction()
    }
  }, [])

  return (
    <>
      <div>
        <Center height="100vh">
          {loader ? (
            <Loader />
          ) : (
            <Stack spacing={8} align="center">
              <Text fontSize="4xl">On Boarding</Text>
              <Text fontSize="3xl">Create a Username</Text>
              <Input
                placeholder="Enter a username"
                value={username}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setUsername(event.target.value)
                }
              />
              <Button onClick={onSubmit} width="100%" isLoading={loading}>
                Save
              </Button>
            </Stack>
          )}
        </Center>
      </div>
    </>
  )
}
