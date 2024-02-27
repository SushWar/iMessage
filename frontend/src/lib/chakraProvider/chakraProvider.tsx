"use client"
import { ChakraProvider } from "@chakra-ui/react"
type Props = {
  children?: React.ReactNode
}

export const ChakraProviderCustom = ({ children }: Props) => {
  return <ChakraProvider>{children}</ChakraProvider>
}
