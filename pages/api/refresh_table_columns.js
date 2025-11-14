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

  const { sourceId, tableCatalog, tableSchema, tableName } = req.body
  if (!sourceId || !tableCatalog || !tableSchema || !tableName) {
    res.status(400).json({ error: "sourceId, tableCatalog, tableSchema, and tableName are required" })
    return
  }

  const workspaceApiKey = getWorkspaceAccessToken(req)

  // Start the refresh
  const apiResponse = await fetch(
    `${censusBaseUrl}/api/v1/sources/${sourceId}/tables/refresh_columns?table_catalog=${encodeURIComponent(
      tableCatalog,
    )}&table_schema=${encodeURIComponent(tableSchema)}&table_name=${encodeURIComponent(tableName)}`,
    {
      method: "POST",
      headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
    },
  )
  await checkStatus(apiResponse, 200, 202)
  const result = await apiResponse.json()
  logger.info([result])

  res.status(200).json(result)
}
