import { createContext, useContext, useState } from "react"

import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"
import { useBasicFetch, useFetchRuns } from "@utils/fetch"

// Create the context
const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { workspaceAccessToken } = useCensusEmbedded()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Destinations data
  const destinations = useBasicFetch(
    () =>
      new Request(`/api/list_destinations`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
  )

  // Destination connect links
  const destinationConnectLinks = useBasicFetch(
    () =>
      new Request(`/api/list_destination_connect_links`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
  )

  // Sources data
  const sources = useBasicFetch(
    () =>
      new Request(`/api/list_sources`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
  )

  const sourceTypes = useBasicFetch(
    () =>
      new Request(`/api/list_source_types`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
  )

  // Source connect links
  const sourceConnectLinks = useBasicFetch(
    () =>
      new Request(`/api/list_source_connect_links`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
  )

  // Sync management links
  const syncManagementLinks = useBasicFetch(
    () =>
      new Request(`/api/list_sync_management_links`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
  )

  // Syncs data
  const syncs = useBasicFetch(
    () =>
      new Request(`/api/list_syncs`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
  )

  // Segments data
  const segments = useBasicFetch(
    () =>
      new Request(`/api/list_segments`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
  )

  // Runs data
  const { runsLoading, runsError, runs } = useFetchRuns(workspaceAccessToken, syncs.loading, syncs.data || [])

  // Simplified Boolean checks for loading and error states
  const isLoading = loading
  const hasError = error !== null

  //   // Loading and error states
  //   const anyError =
  //     destinations.error ??
  //     destinationConnectLinks.error ??
  //     sources.error ??
  //     sourceConnectLinks.error ??
  //     syncManagementLinks.error ??
  //     syncs.error ??
  //     segments.error ??
  //     runsError

  //   const anyLoading =
  //     destinations.loading ||
  //     destinationConnectLinks.loading ||
  //     sources.loading ||
  //     sourceConnectLinks.loading ||
  //     syncManagementLinks.loading ||
  //     syncs.loading ||
  //     segments.loading

  // Context value
  const value = {
    // Data objects
    destinations,
    destinationConnectLinks,
    sources,
    sourceTypes,
    sourceConnectLinks,
    syncManagementLinks,
    syncs,
    segments,

    // Runs data
    runs,
    runsLoading,
    runsError,

    // Loading and error states
    loading,
    setLoading,
    isLoading,
    setError,
    error,
    hasError,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// Custom hook to use the data context
export function useData() {
  const context = useContext(DataContext)
  if (context === null) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
