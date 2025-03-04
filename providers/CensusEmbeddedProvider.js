import { createContext, useContext, useState, useCallback } from "react"
import { useSessionStorage } from "usehooks-ts"

import { useBasicFetch, useFetchRuns } from "@utils/fetch"

// Create the context
const CensusEmbeddedContext = createContext(null)

// Provider component
export function CensusEmbeddedProvider({ children }) {
  // Authentication state - single source of truth
  const [workspaceAccessToken, setWorkspaceAccessTokenInternal] = useSessionStorage("census_api_token", null)
  const [loggedIn, setLoggedIn] = useSessionStorage("census-logged-in", false)

  // UI mode states
  const [embedMode, setEmbedMode] = useState(true)
  const [devMode, setDevMode] = useState(false)

  // Data Loading
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Authentication actions
  const logOut = () => {
    setWorkspaceAccessToken(null)
    setLoggedIn(false)
  }

  // Check if authenticated
  const isAuthenticated = !!workspaceAccessToken

  // Helper function to create requests only when authenticated
  const createRequest = (endpoint) => {
    if (!isAuthenticated) return null
    return new Request(`/api/${endpoint}`, {
      method: "GET",
      headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
    })
  }

  const destinations = useBasicFetch(() => createRequest("list_destinations"), { initial: isAuthenticated })

  // Destination connect links
  const destinationConnectLinks = useBasicFetch(() => createRequest("list_destination_connect_links"), {
    initial: isAuthenticated,
  })

  // Sources data
  const sources = useBasicFetch(() => createRequest("list_sources"), { initial: isAuthenticated })

  const sourceTypes = useBasicFetch(() => createRequest("list_source_types"), { initial: isAuthenticated })

  // Source connect links
  const sourceConnectLinks = useBasicFetch(() => createRequest("list_source_connect_links"), {
    initial: isAuthenticated,
  })

  // Sync management links
  const syncManagementLinks = useBasicFetch(() => createRequest("list_sync_management_links"), {
    initial: isAuthenticated,
  })

  // Syncs data
  const syncs = useBasicFetch(() => createRequest("list_syncs"), { initial: isAuthenticated })

  // Segments data
  const segments = useBasicFetch(() => createRequest("list_segments"), { initial: isAuthenticated })

  // Runs data - only fetch if authenticated and syncs data exists
  const { runsLoading, runsError, runs } = useFetchRuns(
    workspaceAccessToken,
    syncs.loading,
    isAuthenticated ? syncs.data || [] : [],
  )

  const setWorkspaceAccessToken = useCallback(
    (newToken) => {
      const wasAuthenticated = !!workspaceAccessToken
      const willBeAuthenticated = !!newToken

      // Set the token
      setWorkspaceAccessTokenInternal(newToken)

      // If we're becoming authenticated, trigger refetches
      if (!wasAuthenticated && willBeAuthenticated) {
        // Use setTimeout to ensure the token is set before refetching
        setTimeout(() => {
          destinations.refetch()
          destinationConnectLinks.refetch()
          sources.refetch()
          sourceTypes.refetch()
          sourceConnectLinks.refetch()
          syncManagementLinks.refetch()
          syncs.refetch()
          segments.refetch()
        }, 0)
      }
    },
    [
      workspaceAccessToken,
      setWorkspaceAccessTokenInternal,
      destinations,
      destinationConnectLinks,
      sources,
      sourceTypes,
      sourceConnectLinks,
      syncManagementLinks,
      syncs,
      segments,
    ],
  )

  // Simplified Boolean checks for loading and error states
  const isLoading = loading
  const hasError = error !== null

  // Context value
  const value = {
    // Authentication state
    workspaceAccessToken,
    setWorkspaceAccessToken,
    loggedIn,
    setLoggedIn,
    logOut,

    // UI mode states
    embedMode,
    setEmbedMode,
    devMode,
    setDevMode,

    // Data objects - expose both the raw data arrays and the full objects
    destinations: destinations.data || [],
    setDestinations: destinations.setData,

    destinationConnectLinks: destinationConnectLinks.data || [],
    setDestinationConnectLinks: destinationConnectLinks.setData,

    sources: sources.data || [],
    setSources: sources.setData,

    sourceTypes: sourceTypes.data || [],
    setSourceTypes: sourceTypes.setData,

    sourceConnectLinks: sourceConnectLinks.data || [],
    setSourceConnectLinks: sourceConnectLinks.setData,

    syncManagementLinks: syncManagementLinks.data || [],
    setSyncManagementLinks: syncManagementLinks.setData,

    syncs: syncs.data || [],
    setSyncs: syncs.setData,

    segments: segments.data || [],
    setSegments: segments.setData,

    // Runs data
    runs,
    runsLoading,
    runsError,

    // Loading and error states
    loading,
    setLoading,
    isLoading,

    error,
    setError,
    hasError,
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
