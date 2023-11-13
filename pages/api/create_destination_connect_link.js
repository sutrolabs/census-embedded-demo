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

  const { workspaceId, type } = req.body
  const workspaceApiKey = await getWorkspaceApiKey(req, workspaceId)
  const apiResponse = await fetch(`${censusBaseUrl}/api/v1/destination_connect_links`, {
    method: "POST",
    headers: {
      ["authorization"]: `Bearer ${workspaceApiKey}`,
      ["content-type"]: "application/json",
    },
    body: JSON.stringify({
      type,
      redirect_uri: req.headers["referer"],
    }),
  })
  await checkStatus(apiResponse, 201)
  const { data } = await apiResponse.json()
  logger.info([data])
  res.status(201).json(data)
}
