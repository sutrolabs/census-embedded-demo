import { useCallback, useEffect, useState } from "react"

export function useSegmentManagementLink(
  segmentManagementLinks,
  refetchSegmentManagementLinks,
  workspaceAccessToken,
) {
  const [now] = useState(() => new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [segmentManagementLink, setsegmentManagementLink] = useState(() =>
    segmentManagementLinks.find(
      (item) => new Date(item.expiration) > now && !item.revoked && !item.expired && !item.segment_id,
    ),
  )

  const getNewsegmentManagementLink = useCallback(async () => {
    setIsLoading(true)
    const response = await fetch("/api/create_segment_management_link", {
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
    setsegmentManagementLink(newLink)
    setIsLoading(false)
  }, [workspaceAccessToken])

  useEffect(() => {
    if (segmentManagementLink) return
    getNewsegmentManagementLink()
  }, [getNewsegmentManagementLink, segmentManagementLink])

  const resetsegmentManagementLink = async () => {
    await refetchSegmentManagementLinks() // This refetches the segment management links. This is necessary as this hook may be unmounted and remounted due to the iframe exiting. This causes the useState to execute again, voiding the setState update.
    await getNewsegmentManagementLink()
  }

  return [segmentManagementLink, resetsegmentManagementLink, isLoading]
}
