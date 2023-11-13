import fetch from "node-fetch"
import pino from "pino"

import { getWorkspaceApiKey } from "@utils/auth"
import { checkStatus } from "@utils/status"
import { censusBaseUrl } from "@utils/url"

const logger = pino({ name: __filename })

const sourceLabel = "embedded_demo"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({})
    return
  }

  const { workspaceId, id, paused } = req.body
  const workspaceApiKey = await getWorkspaceApiKey(req, workspaceId)
  const apiResponse = await fetch(`${censusBaseUrl}/api/v1/syncs/${id}`, {
    method: "PATCH",
    headers: {
      ["authorization"]: `Bearer ${workspaceApiKey}`,
      ["content-type"]: "application/json",
    },
    body: JSON.stringify({
      paused,
    }),
  })
  await checkStatus(apiResponse, 200)
  const { data } = await apiResponse.json()
  logger.info([data])
  res.status(200).json(data)
}
