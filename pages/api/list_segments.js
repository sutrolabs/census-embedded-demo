import fetch from "node-fetch"
import pino from "pino"

import { getWorkspaceAccessToken } from "@utils/auth"
import { checkStatus } from "@utils/status"
import { censusBaseUrl } from "@utils/url"

const logger = pino({ name: __filename })

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({})
    return
  }

  const allSegments = []
  const workspaceApiKey = getWorkspaceAccessToken(req)

  // This should go through all pages of segments per source to exhaustively get all segments
  // For our demo app, one page per source is enough
  const sources = await getSources(workspaceApiKey)
  for (const source of sources) {
    const apiResponse = await fetch(`${censusBaseUrl}/api/v1/sources/${source.id}/filter_segments`, {
      method: "GET",
      headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
    })
    await checkStatus(apiResponse, 200)
    const { data, allowances } = await apiResponse.json()
    logger.info([data, allowances])
    allSegments.push(...data)
  }
  logger.info(`SEGMENTS: ${JSON.stringify(allSegments)}`)
  res.status(200).json(allSegments)
}

async function getSources(workspaceApiKey) {
  let page = 1
  const allData = []
  while (page) {
    const apiResponse = await fetch(`${censusBaseUrl}/api/v1/sources`, {
      method: "GET",
      headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
    })
    await checkStatus(apiResponse, 200)
    const { pagination, data } = await apiResponse.json()
    logger.info([data])
    allData.push(...data)
    page = pagination.next_page
  }
  return allData
}
