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

  const { destinationId, objectFullName } = getSearchParams(req)
  if (!destinationId || !objectFullName) {
    res.status(400).json({ error: "destinationId and objectFullName are required" })
    return
  }

  const workspaceApiKey = getWorkspaceAccessToken(req)
  const apiResponse = await fetch(
    `${censusBaseUrl}/api/v1/destinations/${destinationId}/objects/${encodeURIComponent(objectFullName)}`,
    {
      method: "GET",
      headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
    },
  )
  await checkStatus(apiResponse, 200)
  const { data } = await apiResponse.json()
  logger.info([data])
  res.status(200).json(data)
}
