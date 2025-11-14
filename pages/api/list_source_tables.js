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

  const { sourceId } = getSearchParams(req)
  if (!sourceId) {
    res.status(400).json({ error: "sourceId is required" })
    return
  }

  const workspaceApiKey = getWorkspaceAccessToken(req)
  const allData = []
  let page = 1
  while (page) {
    const apiResponse = await fetch(`${censusBaseUrl}/api/v1/sources/${sourceId}/tables?page=${page}`, {
      method: "GET",
      headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
    })
    await checkStatus(apiResponse, 200, 202)
    if (apiResponse.status === 202) {
      logger.info(
        `Data not ready yet for sourceId ${sourceId}, returning empty to indicate we should kick off a refresh job`,
      )
      res.status(200).json([])
      return
    }
    const { pagination, data } = await apiResponse.json()
    logger.info([pagination, data])
    allData.push(...data)
    page = pagination.next_page
  }
  res.status(200).json(allData)
}
