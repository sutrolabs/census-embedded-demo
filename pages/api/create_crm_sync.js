import fetch from "node-fetch"
import pino from "pino"

import { getWorkspaceAccessToken } from "@utils/auth"
import { checkStatus } from "@utils/status"
import { censusBaseUrl } from "@utils/url"

const logger = pino({ name: __filename })

const sourceLabel = "embedded_demo"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({})
    return
  }

  const { destinationId, destinationObjectFullName, sourceModelName, primaryIdentifier } = req.body
  const workspaceApiKey = getWorkspaceAccessToken(req)
  const source = await getSource(workspaceApiKey)
  const apiResponse = await fetch(`${censusBaseUrl}/api/v1/syncs`, {
    method: "POST",
    headers: {
      ["authorization"]: `Bearer ${workspaceApiKey}`,
      ["content-type"]: "application/json",
    },
    body: JSON.stringify({
      operation: "update",
      schedule_frequency: "daily",
      schedule_hour: 0,
      schedule_minute: 0,
      source_attributes: {
        connection_id: source.id,
        object: {
          name: sourceModelName,
          type: "model",
        },
      },
      destination_attributes: {
        connection_id: destinationId,
        object: destinationObjectFullName,
      },
      mappings: [
        {
          from: {
            data: primaryIdentifier.from,
            type: "column",
          },
          is_primary_identifier: true,
          to: primaryIdentifier.to,
        },
      ],
    }),
  })
  await checkStatus(apiResponse, 200)
  const { data } = await apiResponse.json()
  logger.info([data])
  await triggerSyncRun(workspaceApiKey, data.sync_id)
  const sync = await getSync(workspaceApiKey, data.sync_id)
  res.status(201).json(sync)
}

async function getSource(workspaceApiKey) {
  let page = 1
  while (page) {
    const apiResponse = await fetch(`${censusBaseUrl}/api/v1/sources`, {
      method: "GET",
      headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
    })
    await checkStatus(apiResponse, 200)
    const { pagination, data } = await apiResponse.json()
    logger.info([data])
    const source = data.find((item) => item.label === sourceLabel)
    if (source) {
      return source
    }
    page = pagination.next_page
  }
  throw new Error("Source not found")
}

async function triggerSyncRun(workspaceApiKey, syncId) {
  const apiResponse = await fetch(`${censusBaseUrl}/api/v1/syncs/${syncId}/trigger`, {
    method: "POST",
    headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
  })
  await checkStatus(apiResponse, 200)
  const { data } = await apiResponse.json()
  logger.info([data])
}

async function getSync(workspaceApiKey, syncId) {
  const apiResponse = await fetch(`${censusBaseUrl}/api/v1/syncs/${syncId}`, {
    method: "GET",
    headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
  })
  await checkStatus(apiResponse, 200)
  const { data } = await apiResponse.json()
  logger.info([data])
  return data
}
