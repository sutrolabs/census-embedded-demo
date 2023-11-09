import { checkStatus } from "@utils/status"
import { censusBaseUrl } from "@utils/url"

export function getPersonalAccessToken(req) {
  return req.headers["authorization"].match(/Bearer (.+)/)[1]
}

export async function getWorkspaceApiKey(req) {
  const personalAccessToken = getPersonalAccessToken(req)
  const workspaceId = req.headers["census-workspace-id"]
  if (!workspaceId) {
    throw new Error("Missing workspace ID header")
  }
  const apiResponse = await fetch(
    `${censusBaseUrl}/api/v1/workspaces/${workspaceId}?return_workspace_api_key=true`,
    {
      method: "GET",
      headers: { ["authorization"]: `Bearer ${personalAccessToken}` },
    },
  )
  await checkStatus(apiResponse, 200)
  const { data } = await apiResponse.json()
  return data.api_key
}
