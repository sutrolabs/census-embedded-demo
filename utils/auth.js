export function getWorkspaceAccessToken(req) {
  return req.headers["authorization"].match(/Bearer (.+)/)[1]
}
