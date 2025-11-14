import fetch from "node-fetch"
import pino from "pino"

import { getWorkspaceAccessToken } from "@utils/auth"
import { setCacheControlHeaders } from "@utils/cacheControlHeaders"
import { getSearchParams } from "@utils/request"
import { checkStatus } from "@utils/status"
import { censusBaseUrl } from "@utils/url"

const logger = pino({ name: __filename })

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({})
    return
  }

  setCacheControlHeaders(res)

  const { destinationId, refresh_key } = getSearchParams(req)
  if (!destinationId) {
    res.status(400).json({ error: "destinationId is required" })
    return
  }
  if (!refresh_key) {
    res.status(400).json({ error: "refresh_key is required" })
    return
  }

  const workspaceApiKey = getWorkspaceAccessToken(req)

  const apiResponse = await fetch(
    `${censusBaseUrl}/api/v1/destinations/${destinationId}/refresh_objects_status?refresh_key=${encodeURIComponent(
      refresh_key,
    )}`,
    {
      method: "GET",
      headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
    },
  )
  await checkStatus(apiResponse, 200)
  const result = await apiResponse.json()
  logger.info([result])

  res.status(200).json(result)
}
