"use client"
import { Session } from "next-auth"
import { Center, Flex } from "@chakra-ui/react"
import ConverstationWrapper from "./conversation/conversationWrapper"
import FeddWrapper from "./feed/feedWrapper"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import Loader from "@/lib/components/loader"

interface Wrapper {
  session: Session
}

export default function MessageClientPage({ session }: Wrapper) {
  const [loader, setLoader] = useState(true)

  /*
   * check authentic user and if onboarding is completed, otherwise redirect to respected page
   * check if the cookie is set or not, to avoid sending post request again and again
   */

  const checkAction = async () => {
    try {
      if (!session.user) {
        redirect(`/auth/login`)
      } else if (!session.user.onboarding) {
        redirect("/onboarding")
      }

      const alreadyCookie = await axios.get("/api/cookie/getCookie", {
        params: { name: "clientToken" },
      })
      if (alreadyCookie.data.data) {
        console.log("Cookie already set")
      } else {
        console.log("Cookie Not set")
        const response = await axios.post("/api/cookie/setCookie", {
          name: "clientToken",
        })
      }
    } catch (error: any) {
      console.log(
        "Error in Message Client page check action :- ",
        error.message
      )
    } finally {
      setLoader(false)
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
        {loader ? (
          <Center height="100vh">
            <Loader />
          </Center>
        ) : (
          <Flex height={"100vh"}>
            <ConverstationWrapper session={session} />
            <FeddWrapper session={session} />
          </Flex>
        )}
      </div>
    </div>
  )
}
