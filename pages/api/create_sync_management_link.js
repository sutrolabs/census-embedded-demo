import fetch from "node-fetch"
import pino from "pino"

import { getWorkspaceAccessToken } from "@utils/auth"
import { checkStatus } from "@utils/status"
import { censusBaseUrl } from "@utils/url"

const logger = pino({ name: __filename })

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({})
    return
  }

  const workspaceApiKey = await getWorkspaceAccessToken(req)
  const apiResponse = await fetch(`${censusBaseUrl}/api/v1/sync_management_links`, {
    method: "POST",
    headers: { ["authorization"]: `Bearer ${workspaceApiKey}`, ["content-type"]: "application/json" },
  })
  await checkStatus(apiResponse, 201)
  const { data } = await apiResponse.json()
  res.status(200).json(data)
}
