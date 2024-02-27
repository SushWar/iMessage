import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, res: NextResponse) {
  // const allCookies = request.cookies.get("clientToken")

  const response = NextResponse.next()

  //after onboarding the cookie needs to be updated

  // if (request.nextUrl.pathname.startsWith("/v1")) {
  //   console.log("Invoking only at v1")
  //   console.log("ALL COOKIES --------- ", allCookies)
  //   if (allCookies) {
  //     console.log("cookie already set")
  //   } else {
  //     console.log("cookie set")
  //     return NextResponse.redirect(new URL("/api/setCookie", request.url))
  //   }
  // }

  return response
}

// export const config = {
//   matcher: "/v1/*",
// }
