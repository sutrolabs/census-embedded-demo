import { getLogoForSourceType } from "@hooks/useSourceLogos"

export const getSourceMetadataFromConnectionId = (connectionId, sources = []) => {
  if (!connectionId || !sources.length) return null

  // Find the source with the matching connection_id
  const sourceEntity = sources.find((source) => source.id === connectionId)

  if (!sourceEntity) return null

  // Get the source type information
  const sourceType = getSourceTypeFromServiceName(sourceEntity.type)

  // Get the logo for the source type
  const logo = getLogoForSourceType(sourceType)

  return {
    id: sourceEntity.id,
    name: sourceEntity.name,
    type: sourceEntity.type,
    object: sourceEntity.object,
    logo,
    sourceType,
    // Add any other metadata you need
  }
}

export const getSourceTypeFromServiceName = (serviceName, availableSourceTypes = []) => {
  if (!serviceName) return null

  // If availableSourceTypes is provided, search in it
  if (availableSourceTypes.length) {
    return availableSourceTypes.find((type) => type.service_name === serviceName) || null
  }

  // Otherwise, return a minimal source type object
  return {
    service_name: serviceName,
    label: serviceName.charAt(0).toUpperCase() + serviceName.slice(1).replace(/_/g, " "),
  }
}
