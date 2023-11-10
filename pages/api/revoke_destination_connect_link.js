import fetch from "node-fetch"
import pino from "pino"

import { getWorkspaceApiKey } from "@utils/auth"
import { checkStatus } from "@utils/status"
import { censusBaseUrl } from "@utils/url"

const logger = pino({ name: __filename })

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({})
    return
  }

  const workspaceApiKey = await getWorkspaceApiKey(req)
  const apiResponse = await fetch(`${censusBaseUrl}/api/v1/destination_connect_links/${req.body.id}/revoke`, {
    method: "POST",
    headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
  })
  await checkStatus(apiResponse, 201)
  const { data } = await apiResponse.json()
  logger.info([data])
  res.status(200).json(data)
}
