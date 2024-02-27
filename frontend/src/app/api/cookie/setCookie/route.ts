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

// export async function GET(request: NextRequest) {
//   const session: Session | null = await getServerSession(authConfig)
//   const requestUrl = new URL(request.url)
//   const url = process.env.NEXTAUTH_URL
//   console.log("GET request for set cookie", session)
//   let response

//   if (!session?.user) {
//     return NextResponse.redirect(`${url}`)
//   } else if (!session?.user.onboarding) {
//     console.log("Onboarding not done")
//     response = NextResponse.redirect(`${url}/onboarding`)
//   } else {
//     console.log("Onboarding completes")
//     response = NextResponse.redirect(requestUrl.origin)
//   }

//   if (session?.user) {
//     const encode = await encodeValue(session?.user)
//     // console.log("Inside set cookie function")
//     // console.log(session)
//     // console.log(encode)
//     response.cookies.set("clientToken", encode, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "strict",
//       path: "/",
//     })
//   }
//   return response
// }
