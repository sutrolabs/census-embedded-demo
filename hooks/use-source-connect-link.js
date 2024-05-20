import { useEffect, useState } from "react"

export function useSourceConnectLink(sourceConnectLinks, type, workspaceAccessToken) {
  const [isLoading, setIsLoading] = useState(false)
  const [sourceConnectLink, setSourceConnectLink] = useState(
    sourceConnectLinks.find((item) => item.type === type && !item.expired && !item.source_id),
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

  // Automatically upset sourceConnectLink when the sourceConnectLinks change (possibly from a refetch)
  useEffect(() => {
    setSourceConnectLink(sourceConnectLinks.find((item) => item.type === type && !item.expired && !item.source_id))
  }, [sourceConnectLinks, type])

  return [sourceConnectLink, getNewSourceConnectLink, isLoading]
}
