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

  const workspaceApiKey = getWorkspaceAccessToken(req)
  const apiResponse = await fetch(
    `${censusBaseUrl}/api/v1/destinations/get_or_create_embedded_demo_destination`,
    {
      method: "POST",
      headers: {
        ["authorization"]: `Bearer ${workspaceApiKey}`,
        ["content-type"]: "application/json",
      },
    },
  )
  await checkStatus(apiResponse, 200, 201)
  const { data } = await apiResponse.json()
  logger.info([data])
  res.status(apiResponse.status).json(data)
}
