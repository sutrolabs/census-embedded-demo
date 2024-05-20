import fetch from "node-fetch"
import pino from "pino"

import { getWorkspaceAccessToken } from "@utils/auth"
import { censusBaseUrl } from "@utils/url"

const logger = pino({ name: __filename })

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({})
    return
  }

  const workspaceAccessToken = getWorkspaceAccessToken(req)
  const apiResponse = await fetch(`${censusBaseUrl}/api/v1/workspace/`, {
    method: "GET",
    headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
  })
  const body = await apiResponse.json()
  logger.info([apiResponse.status, body])
  res.status(apiResponse.status).json(body)
}
