import fetch from "node-fetch"
import pino from "pino"

const logger = pino()

const censusBaseUrl = process.env["CENSUS_BASE_URL"] ?? "https://app.getcensus.com"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({})
    return
  }

  const apiResponse = await fetch(`${censusBaseUrl}/api/v1/describe`, {
    method: "GET",
    headers: { ["authorization"]: req.headers["authorization"] },
  })
  logger.info("test-api-key", apiResponse.status, await apiResponse.text())
  res.status(apiResponse.status).json({})
}