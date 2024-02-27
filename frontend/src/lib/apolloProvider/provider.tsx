"use client"

import { ApolloProvider } from "@apollo/client"
import { client } from "@/graphql/apollo-client"
type Props = {
  children?: React.ReactNode
}

export const ApolloProviderCustom = ({ children }: Props) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
