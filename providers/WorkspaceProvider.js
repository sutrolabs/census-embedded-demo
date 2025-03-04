import { createContext, useContext } from "react"
import { useSessionStorage } from "usehooks-ts"

// Create the context
const WorkspaceContext = createContext(null)

// Provider component
export function WorkspaceProvider({ children }) {
  // Authentication state
  const [workspaceAccessToken, setWorkspaceAccessToken] = useSessionStorage("census_api_token", null)
  const [loggedIn, setLoggedIn] = useSessionStorage("census-logged-in", false)

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
  }

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

// Custom hook to use the context
export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (context === null) {
    throw new Error("useWorkspace must be used within an Workspace Provider")
  }
  return context
}
