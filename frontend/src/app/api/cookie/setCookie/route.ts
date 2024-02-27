import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { authConfig } from "@/lib/authProvider/auth"
import type { Session } from "next-auth"
import { getServerSession } from "next-auth"
import { encodeValue } from "@/util/jwt"

export async function POST(req: NextRequest, res: NextResponse) {
  const session: Session | null = await getServerSession(authConfig)
  const { name } = await req.json()

  // Set the cookie
  const encode = await encodeValue(session?.user)
  const response = NextResponse.json({
    success: true,
    message: "Cookie set successfully",
  })
  response.cookies.set(name, encode, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  })

  return response
}
