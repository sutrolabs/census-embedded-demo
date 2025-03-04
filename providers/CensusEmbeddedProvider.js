import { createContext, useContext, useState } from "react"

import { useWorkspace } from "@providers/WorkspaceProvider"
import { useBasicFetch, useFetchRuns } from "@utils/fetch"

// Create the context
const CensusEmbeddedContext = createContext(null)

// Provider component
export function CensusEmbeddedProvider({ children }) {
  // Authentication state
  const { workspaceAccessToken, loggedIn, setLoggedIn, logOut } = useWorkspace()

  // UI mode states
  const [embedMode, setEmbedMode] = useState(true)
  const [devMode, setDevMode] = useState(false)

  // Data Loading
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Only make API calls if we have a token
  const hasToken = !!workspaceAccessToken

  const destinations = useBasicFetch(
    () =>
      new Request(`/api/list_destinations`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
    { initial: hasToken },
  )
  // Destination connect links
  const destinationConnectLinks = useBasicFetch(
    () =>
      new Request(`/api/list_destination_connect_links`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
    { initial: hasToken },
  )

  // Sources data
  const sources = useBasicFetch(
    () =>
      new Request(`/api/list_sources`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
    { initial: hasToken },
  )

  const sourceTypes = useBasicFetch(
    () =>
      new Request(`/api/list_source_types`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
    { initial: hasToken },
  )

  // Source connect links
  const sourceConnectLinks = useBasicFetch(
    () =>
      new Request(`/api/list_source_connect_links`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
    { initial: hasToken },
  )

  // Sync management links
  const syncManagementLinks = useBasicFetch(
    () =>
      new Request(`/api/list_sync_management_links`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
    { initial: hasToken },
  )

  // Syncs data
  const syncs = useBasicFetch(
    () =>
      new Request(`/api/list_syncs`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
    { initial: hasToken },
  )

  // Segments data
  const segments = useBasicFetch(
    () =>
      new Request(`/api/list_segments`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      }),
    { initial: hasToken },
  )

  // Runs data
  const { runsLoading, runsError, runs } = useFetchRuns(
    workspaceAccessToken,
    syncs.loading,
    hasToken ? syncs.data || [] : [],
  )

  // Simplified Boolean checks for loading and error states
  const isLoading = loading
  const hasError = error !== null

  // Context value
  const value = {
    // Authentication state
    workspaceAccessToken,
    loggedIn,
    logOut,

    // UI mode states
    embedMode,
    setEmbedMode,
    devMode,
    setDevMode,

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
    isLoading, // Primarily used as a boolean flag in _app to manage global loading boundary

    error,
    setError,
    hasError, // Primarily used as a boolean flag in _app to manage global error boundary,
  }

  return <CensusEmbeddedContext.Provider value={value}>{children}</CensusEmbeddedContext.Provider>
}

// Custom hook to use the context
export function useCensusEmbedded() {
  const context = useContext(CensusEmbeddedContext)
  if (context === null) {
    throw new Error("useCensusEmbedded must be used within an Census Embedded Provider")
  }
  return context
}
