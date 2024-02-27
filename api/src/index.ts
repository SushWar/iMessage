import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { makeExecutableSchema } from "@graphql-tools/schema"
import express from "express"
import http from "http"
import cors from "cors"
import typeDefs from "./graphql/typeDefs"
import resolvers from "./graphql/resolvers"
import * as dotenv from "dotenv"
import { json } from "body-parser"
import * as jwt from "next-auth/jwt"
import { GraphQLContext, Session, SubscriptionContext } from "./util/type"
import { connect } from "./mongodb/dbconfig"
import { WebSocketServer } from "ws"
import { useServer } from "graphql-ws/lib/use/ws"
import { PubSub } from "graphql-subscriptions"

const main = async () => {
  interface MyContext {
    token?: String
  }
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  })

  dotenv.config()
  const app = express()
  const httpServer = http.createServer(app)

  await connect()
  const pubsub = new PubSub()
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: "/graphql/subscriptions",
  })

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => {
        // console.log("Inside CTX connections")
        if (ctx.connectionParams && ctx.connectionParams.session) {
          const { session } = ctx.connectionParams
          return { session: session, pubsub: pubsub }
        }
        return { session: null, pubsub: pubsub }
      },
    },
    wsServer
  )
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })
  const corsOptions = {
    origin: process.env.BASE_URL,
    credentials: true,
  }

  await server.start()
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<GraphQLContext> => {
        try {
          const headCookies = req?.headers.cookie?.split(";")

          const idx: any = headCookies?.filter((item: string, id: number) => {
            if (
              item.includes("clientToken") ||
              item.includes("clientBoardToken")
            ) {
              return id
            }
          })

          const sessiontoken = idx[0]?.split("=")
          const decode = await jwt.decode({
            token: sessiontoken?.at(1),
            secret: String(process.env.NEXTAUTH_SECRET),
          })

          if (!decode) {
            console.log("Decode is null")
            return { session: null, pubsub: pubsub }
          }
          // console.log(decode)
          return { session: decode as unknown as Session, pubsub: pubsub }
        } catch (error) {
          console.log("Error ----------> ", error)
          return { session: null, pubsub: pubsub }
        }
      },
    })
  )

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  )
  console.log(`🚀 Server ready at http://localhost:4000/graphql`)
}

main().catch((err) => console.log(err))
