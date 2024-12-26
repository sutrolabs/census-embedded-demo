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

  const { sourceId, segmentId } = req.body
  const CENSUS_API_EDIT_SEGMENT = `${censusBaseUrl}/api/v1/sources/${sourceId}/filter_segments/${segmentId}/segment_management_links`
  const workspaceApiKey = getWorkspaceAccessToken(req)
  const apiResponse = await fetch(CENSUS_API_EDIT_SEGMENT, {
    method: "POST",
    headers: { ["authorization"]: `Bearer ${workspaceApiKey}`, ["content-type"]: "application/json" },
    body: JSON.stringify({
      redirect_uri: req.headers["referer"],
    }),
  })
  await checkStatus(apiResponse, 201)
  const { data } = await apiResponse.json()
  logger.info([data])
  res.status(200).json(data)
}
