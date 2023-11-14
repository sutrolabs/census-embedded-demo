import fetch from "node-fetch"
import pino from "pino"

import { getWorkspaceApiKey } from "@utils/auth"
import { getSearchParams } from "@utils/request"
import { checkStatus } from "@utils/status"
import { censusBaseUrl } from "@utils/url"

const logger = pino({ name: __filename })

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({})
    return
  }

  const { workspaceId, syncId } = getSearchParams(req)
  const workspaceApiKey = await getWorkspaceApiKey(req, workspaceId)
  const apiResponse = await fetch(`${censusBaseUrl}/api/v1/syncs/${syncId}/sync_runs?per_page=1`, {
    method: "GET",
    headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
  })
  await checkStatus(apiResponse, 200)
  const { data } = await apiResponse.json()
  logger.info([data])
  res.status(200).json(data[0] ?? null)
}
