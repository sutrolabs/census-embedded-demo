import fetch from "node-fetch"
import pino from "pino"

import { getWorkspaceAccessToken } from "@utils/auth"
import { setCacheControlHeaders } from "@utils/cacheControlHeaders"
import { checkStatus } from "@utils/status"
import { censusBaseUrl } from "@utils/url"

const logger = pino({ name: __filename })

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({})
    return
  }

  setCacheControlHeaders(res)

  const workspaceApiKey = getWorkspaceAccessToken(req)

  const apiResponse = await fetch(`${censusBaseUrl}/api/v1/source_types`, {
    method: "GET",
    headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
  })

  await checkStatus(apiResponse, 200)
  const { data } = await apiResponse.json()
  logger.info(data)

  res.status(200).json(data)
}
