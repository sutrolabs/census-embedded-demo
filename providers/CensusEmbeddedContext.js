import { createContext, useContext, useState } from "react"
import { useSessionStorage } from "usehooks-ts"

// Create the context
const CensusEmbeddedContext = createContext(null)

// Provider component
export function CensusEmbeddedProvider({ children }) {
  // Authentication state
  const [workspaceAccessToken, setWorkspaceAccessToken] = useSessionStorage("census_api_token", null)
  const [loggedIn, setLoggedIn] = useSessionStorage("census-logged-in", false)

  // UI mode states
  const [embedMode, setEmbedMode] = useState(true)
  const [devMode, setDevMode] = useState(false)

  // Authentication actions
  const logOut = () => {
    setWorkspaceAccessToken(null)
    setLoggedIn(false)
  }

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
