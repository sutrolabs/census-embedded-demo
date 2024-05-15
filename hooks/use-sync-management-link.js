import { useEffect, useState } from "react"

export function useSyncManagementLink(syncManagementLinks, workspaceAccessToken) {
  const [now] = useState(() => new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [syncManagementLink, setSyncManagementLink] = useState(
    syncManagementLinks.find((item) => new Date(item.expiration) > now && !item.revoked && !item.expired),
  )

  useEffect(() => {
    async function getNewSourceConnectLink() {
      setIsLoading(true)
      const response = await fetch("/api/create_sync_management_link", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
      })
      if (!response.ok) {
        setIsLoading(false)
        throw new Error(response.statusText)
      }
      const newLink = await response.json()
      setSyncManagementLink(newLink)
      setIsLoading(false)
    }

    if (syncManagementLink) return
    getNewSourceConnectLink()
  }, [syncManagementLink, setSyncManagementLink, workspaceAccessToken])

  const resetSyncManagementLink = () => setSyncManagementLink(null)

  return [syncManagementLink, resetSyncManagementLink, isLoading]
}
