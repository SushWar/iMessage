import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: NextRequest, res: NextResponse) {
  const params = req.nextUrl.searchParams.get("name")
  const cookieStore = cookies()

  if (params) {
    const clientToken = cookieStore.get(params)
    const response = NextResponse.json({
      data: clientToken?.value,
      message: "Cookie fetch successfully",
    })

    return response
  }

  return null
}
