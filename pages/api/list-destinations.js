import fetch from "node-fetch"
import pino from "pino"

const logger = pino()

const censusBaseUrl = process.env["CENSUS_BASE_URL"] ?? "https://app.getcensus.com"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({})
    return
  }

  const apiResponse = await fetch(`${censusBaseUrl}/api/v1/destinations`, {
    method: "GET",
    headers: { ["authorization"]: req.headers["authorization"] },
  })
  const { data } = await apiResponse.json()
  logger.info("list-destinations", apiResponse.status, data)
  res.status(apiResponse.status).json(data)
}
