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

  const { sourceId, sourceTableName, sourceTableCatalog, sourceTableSchema, destinationId, destinationObject, operation, mappings } = req.body

  if (!sourceId || !sourceTableName || !sourceTableCatalog || !sourceTableSchema || !destinationId || !destinationObject || !operation || !mappings) {
    res.status(400).json({ error: "Missing required fields" })
    return
  }

  const workspaceApiKey = getWorkspaceAccessToken(req)

  const apiResponse = await fetch(`${censusBaseUrl}/api/v1/syncs`, {
    method: "POST",
    headers: {
      ["authorization"]: `Bearer ${workspaceApiKey}`,
      ["content-type"]: "application/json",
    },
    body: JSON.stringify({
      operation,
      schedule_frequency: "never",
      source_attributes: {
        connection_id: sourceId,
        object: {
          table_name: sourceTableName,
          table_catalog: sourceTableCatalog,
          table_schema: sourceTableSchema,
          type: "table",
        },
      },
      destination_attributes: {
        connection_id: destinationId,
        object: destinationObject,
      },
      mappings,
    }),
  })
  await checkStatus(apiResponse, 200)
  const { data } = await apiResponse.json()
  logger.info([data])
  res.status(201).json(data)
}
