"use client"

import { Button } from "@chakra-ui/react"
import axios from "axios"
import { signOut } from "next-auth/react"

export default function ClientLogout() {
  const handleLogin = async () => {
    const response = await axios.post("/api/cookie/deleteCookie", {
      name: "clientToken",
    })
    console.log(response)
    await signOut({
      redirect: true,
      callbackUrl: "/", // redirect after login to /
    })
  }
  return (
    <>
      <Button onClick={handleLogin}>Log out</Button>
    </>
  )
}
