import * as jwt from "next-auth/jwt"

const encodeValue = async (info: any): Promise<string> => {
  console.log("Inside JWT encoder")
  const secret = JSON.stringify(info)
  const value = jwt.encode({
    token: info,
    secret: process.env.NEXTAUTH_SECRET!,
  })
  return value
}

export { encodeValue }
