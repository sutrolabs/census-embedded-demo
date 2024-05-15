import { useState } from "react"

export function useSourceConnectLink(sourceConnectLinks, type, workspaceAccessToken) {
  const [now] = useState(() => new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [sourceConnectLink, setSourceConnectLink] = useState(
    sourceConnectLinks.find(
      (item) => item.type === type && new Date(item.expiration) > now && !item.revoked && !item.source_id,
    ),
  )

  const getNewSourceConnectLink = async () => {
    setIsLoading(true)
    const response = await fetch("/api/create_source_connect_link", {
      method: "POST",
      headers: {
        ["authorization"]: `Bearer ${workspaceAccessToken}`,
        ["content-type"]: "application/json",
      },
      body: JSON.stringify({
        type,
      }),
    })
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const newLink = await response.json()
    setSourceConnectLink(newLink)
    setIsLoading(false)
    return newLink
  }

  return [sourceConnectLink, getNewSourceConnectLink, isLoading]
}
