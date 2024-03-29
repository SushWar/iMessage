"use client"
import { signIn, useSession } from "next-auth/react"
import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import Loader from "@/lib/components/loader"

export default function Login() {
  const session = useSession()
  const [loader, setLoader] = useState(true)

  const checkAction = () => {
    console.log("Inside Login page. Session expiry :- ", session.data?.expires)

    try {
      if (session.data && session.status === "authenticated") {
        if (session.data.user.onboarding === true) {
          redirect(`/v1/imessage`)
        } else {
          redirect("/onboarding")
        }
      } else {
        setLoader(false)
      }
    } catch (error) {
      console.log("Loader error in Login")
    }
  }

  useEffect(() => {
    checkAction()

    return () => {
      checkAction()
    }
  }, [])

  const handleLogin = async () => {
    await signIn("google", {
      redirect: true,
      callbackUrl: "/", // redirect after login to /
    })
  }
  return (
    <>
      <Center height="100vh">
        {loader ? (
          <Loader />
        ) : (
          <Stack spacing={8} align="center">
            <Text fontSize="4xl">MessengerQL</Text>
            <Stack align="center">
              <Button onClick={() => signIn("google")}>
                Continue with Email
              </Button>
              <Button onClick={handleLogin}>Continue with Google</Button>
            </Stack>{" "}
          </Stack>
        )}
      </Center>
    </>
  )
}
