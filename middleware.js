// middleware.js
import { NextResponse } from "next/server"

export function middleware(request) {
  // Clone the response
  const response = NextResponse.next()

  // Set headers to prevent caching
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate")
  response.headers.set("Pragma", "no-cache")
  response.headers.set("Expires", "0")

  // Remove ETag header to prevent conditional requests
  response.headers.delete("ETag")

  return response
}

export const config = {
  // Apply this middleware only to API routes
  matcher: "/api/:path*",
}
