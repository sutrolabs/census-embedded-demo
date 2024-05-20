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

  const workspaceApiKey = getWorkspaceAccessToken(req)
  const allData = []
  let page = 1
  while (page) {
    const apiResponse = await fetch(`${censusBaseUrl}/api/v1/sources?page=${page}`, {
      method: "GET",
      headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
    })
    await checkStatus(apiResponse, 200)
    const { pagination, data } = await apiResponse.json()
    logger.info([pagination, data])
    allData.push(...data)
    page = pagination.next_page
  }
  res.status(200).json(allData)
}
