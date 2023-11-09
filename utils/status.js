import pino from "pino"

const logger = pino({ name: __filename })

export async function checkStatus(apiResponse, ...allowedStatuses) {
  if (!allowedStatuses.includes(apiResponse.status)) {
    logger.error([apiResponse.status, await apiResponse.text()])
    throw new Error(`Unexpected response status ${apiResponse.status}`)
  }
}
