import fetch from "node-fetch"
import pino from "pino"

import { getPersonalAccessToken } from "@utils/auth"
import { censusBaseUrl } from "@utils/url"

const logger = pino({ name: __filename })

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({})
    return
  }

  const personalAccessToken = getPersonalAccessToken(req)
  const apiResponse = await fetch(`${censusBaseUrl}/api/v1/workspaces/`, {
    method: "GET",
    headers: { ["authorization"]: `Bearer ${personalAccessToken}` },
  })
  logger.info([apiResponse.status, await apiResponse.text()])
  res.status(apiResponse.status).json({})
}
