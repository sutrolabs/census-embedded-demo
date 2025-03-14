export function setCacheControlHeaders(response) {
  response.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate")
}
