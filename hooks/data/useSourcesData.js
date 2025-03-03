import { useMemo } from "react"

import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"

export function useSourcesData() {
  const { sources, sourceTypes, sourceConnectLinks, workspaceAccessToken } = useCensusEmbedded()

  // Derived/computed values
  const enhancedSources = useMemo(() => {
    if (!sources.data || !sourceTypes.data) return []

    return sources.data.map((source) => ({
      ...source,
      // Add type information
      typeDetails: sourceTypes.data.find((type) => type.id === source.typeId),
      // Add connect link if available
      connectLink: sourceConnectLinks.data?.find((link) => link.sourceId === source.id)?.url,
    }))
  }, [sources.data, sourceTypes.data, sourceConnectLinks.data])

  // Loading and error states specific to sources
  const isLoading = sources.loading || sourceTypes.loading || sourceConnectLinks.loading
  const error = sources.error || sourceTypes.error || sourceConnectLinks.error

  return {
    sources: enhancedSources,
    rawSources: sources.data,
    sourceTypes: sourceTypes.data,
    isLoading,
    error,
    refetchSources: sources.refetch,
    // Additional methods or values specific to sources
  }
}
