import fetch from "node-fetch"
import pino from "pino"

import { getWorkspaceAccessToken } from "@utils/auth"
import { checkStatus } from "@utils/status"
import { censusBaseUrl } from "@utils/url"
import { getSearchParams } from "@utils/request"
import { useRouter } from "next/router"

const logger = pino({ name: __filename })

export default async function handler(req, res) {
  console.log("req", req)
  if (req.method !== "GET") {
    res.status(405).json({})
    return
  }
  const { query } = useRouter()
  const workspaceApiKey = getWorkspaceAccessToken(req)

  //   const { sourceId } = getSearchParams(req)
  if (!sourceId) return
  const allData = []
  let page = 1
  while (page) {
    const apiResponse = await fetch(`${censusBaseUrl}/api/v1/sources/${query.id}/models?page=${page}`, {
      method: "GET",
      headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
    })
    console.log("api res", apiResponse)
    await checkStatus(apiResponse, 200)
    const { pagination, data } = await apiResponse.json()
    logger.info([pagination, data])
    allData.push(...data)
    page = pagination.next_page
  }
  res.status(200).json(allData)
}
