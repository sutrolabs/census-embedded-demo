import { useState } from "react"

import Button from "@components/Button/Button/Button"
import EmbeddedFrame from "@components/EmbeddedFrame/EmbeddedFrame"
import { useDestinationFlow } from "@providers/DestinationFlowProvider"

export default function DestinationConnectionForm() {
  const {
    selectedDestinationType: destinationType,
    workspaceAccessToken,
    goToConfigureDestination: onDestinationConnected,
    goBack: onBack,
    destinationConnectLinks = [],
    refetchDestinationConnectLinks,
    embedMode = true,
  } = useDestinationFlow()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showEmbeddedFrame, setShowEmbeddedFrame] = useState(false)

  // Find an existing, valid connect link for this destination type
  const destinationConnectLink = destinationConnectLinks.find(
    (link) => link.type === destinationType?.service_name && !link.revoked && !link.destination_id,
  )

  const initiateDestinationConnectFlow = (connectLinkData) => {
    if (embedMode) {
      setShowEmbeddedFrame(true)
    } else {
      window.location.href = connectLinkData.uri
    }
  }

  const onExitedConnectionFlow = async (connectionDetails) => {
    setLoading(false)

    if (connectionDetails.status === "created") {
      await refetchDestinationConnectLinks()

      onDestinationConnected({
        id: connectionDetails.details.id,
        type: destinationType.service_name,
        name: connectionDetails.details.name || destinationType.label,
      })
    } else {
      setShowEmbeddedFrame(false)
    }
  }

  const handleConnect = async () => {
    try {
      setLoading(true)
      setError(null)

      if (destinationConnectLink) {
        initiateDestinationConnectFlow(destinationConnectLink)
      } else {
        const response = await fetch("/api/create_destination_connect_link", {
          method: "POST",
          headers: {
            ["authorization"]: `Bearer ${workspaceAccessToken}`,
            ["content-type"]: "application/json",
          },
          body: JSON.stringify({
            type: destinationType.service_name,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to create connection link")
        }

        const newLink = await response.json()
        initiateDestinationConnectFlow(newLink)
      }
    } catch (err) {
      setError(err.message || "Failed to create connection link")
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {error && <div className="rounded bg-red-50 p-4 text-red-500">{error}</div>}

      {showEmbeddedFrame ? (
        <div className="mb-8 h-full w-full">
          <EmbeddedFrame
            connectLink={destinationConnectLink?.uri}
            onExit={onExitedConnectionFlow}
            className="h-full"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-neutral-600">
            Connect your {destinationType?.label} account to start syncing data.
          </p>
          <Button className="w-full" onClick={handleConnect} loading={loading} disabled={loading}>
            Connect {destinationType?.label}
          </Button>
        </div>
      )}
    </div>
  )
}
