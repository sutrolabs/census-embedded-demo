import { useCallback, useEffect, useState } from "react"

export function useSyncManagementLink(syncManagementLinks, refetchSyncManagementLinks, workspaceAccessToken) {
  const [now] = useState(() => new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [syncManagementLink, setSyncManagementLink] = useState(() =>
    syncManagementLinks.find(
      (item) => new Date(item.expiration) > now && !item.revoked && !item.expired && !item.sync_id,
    ),
  )

  const getNewSyncManagementLink = useCallback(async () => {
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
  }, [workspaceAccessToken])

  useEffect(() => {
    if (syncManagementLink) return
    getNewSyncManagementLink()
  }, [getNewSyncManagementLink, syncManagementLink])

  const resetSyncManagementLink = async () => {
    await refetchSyncManagementLinks() // This refetches the sync management links. This is necessary as this hook may be unmounted and remounted due to the iframe exiting. This causes the useState to execute again, voiding the setState update.
    await getNewSyncManagementLink()
  }

  return [syncManagementLink, resetSyncManagementLink, isLoading]
}
