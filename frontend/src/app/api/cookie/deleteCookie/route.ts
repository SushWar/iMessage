import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { authConfig } from "@/lib/authProvider/auth"
import type { Session } from "next-auth"
import { getServerSession } from "next-auth"
import { encodeValue } from "@/util/jwt"

// import { NextResponse } from "next/server"

export async function POST(req: NextRequest, res: NextResponse) {
  const session: Session | null = await getServerSession(authConfig)
  const { name } = await req.json()

  // Update the cookie
  const encode = await encodeValue(session?.user)
  const response = NextResponse.json({
    message: "Cookie Deleted successfully",
  })
  response.cookies.delete(name)

  return response
}
