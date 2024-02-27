"use client"
import { Session } from "next-auth"
import { Flex, Spinner } from "@chakra-ui/react"
import ConverstationWrapper from "./conversation/conversationWrapper"
import FeddWrapper from "./feed/feedWrapper"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"

interface Wrapper {
  session: Session
}

export default function MessageClientPage({ session }: Wrapper) {
  const [loadPage, setLoadPage] = useState(true)
  const checkAction = async () => {
    console.log("Inside Client page , ", session.expires)
    try {
      if (!session.user) {
        redirect(`/auth/login`)
      } else if (!session.user.onboarding) {
        redirect("/onboarding")
      }

      const response = await axios.post("/api/cookie/setCookie", {
        name: "clientToken",
      })
      console.log(response)
    } catch (error: any) {
      console.log(
        "Error in Message Client page check action :- ",
        error.message
      )
    } finally {
      setLoadPage(false)
    }
  }

  useEffect(() => {
    checkAction()

    return () => {
      checkAction()
    }
  }, [])

  return (
    <div>
      <div>
        <Flex height={"100vh"}>
          {loadPage ? (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          ) : (
            <>
              <ConverstationWrapper session={session} />
              <FeddWrapper session={session} />
            </>
          )}
        </Flex>
      </div>
    </div>
  )
}
