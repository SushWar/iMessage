import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest, res: NextResponse) {
  const { name } = await req.json()

  //Delete the cookie
  const response = NextResponse.json({
    message: "Cookie Deleted successfully",
  })
  response.cookies.delete(name)

  return response
}
