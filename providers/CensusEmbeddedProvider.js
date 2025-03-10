import { createContext, useContext, useState } from "react"
import { useSessionStorage } from "usehooks-ts"

// Create the context
const CensusEmbeddedContext = createContext(null)

// Provider component
export function CensusEmbeddedProvider({ children }) {
  // Authentication state - single source of truth
  const [workspaceAccessToken, setWorkspaceAccessToken] = useSessionStorage("census_api_token", null)
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
