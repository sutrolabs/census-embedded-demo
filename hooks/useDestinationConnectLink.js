import { useEffect, useState } from "react"

export function useDestinationConnectLink(destinationConnectLinks, type, workspaceAccessToken) {
  const [isLoading, setIsLoading] = useState(false)
  const [destinationConnectLink, setDestinationConnectLink] = useState(
    destinationConnectLinks.find((item) => item.type === type && !item.revoked && !item.destination_id),
  )

  const getNewDestinationConnectLink = async () => {
    setIsLoading(true)
    const response = await fetch("/api/create_destination_connect_link", {
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
    setDestinationConnectLink(newLink)
    setIsLoading(false)
    return newLink
  }

  // Automatically update destinationConnectLink when the destinationConnectLinks change (possibly from a refetch)
  useEffect(() => {
    setDestinationConnectLink(
      destinationConnectLinks.find((item) => item.type === type && !item.revoked && !item.destination_id),
    )
  }, [destinationConnectLinks, type])

  return [destinationConnectLink, getNewDestinationConnectLink, isLoading]
}
