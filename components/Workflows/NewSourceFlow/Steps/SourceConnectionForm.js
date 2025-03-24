import { useState, useEffect } from "react"

import EmbeddedFrame from "@components/EmbeddedFrame/EmbeddedFrame"
import { useSourceConnectLink } from "@hooks/use-source-connect-link"
import { useSourceFlow } from "@providers/SourceFlowProvider"

export default function SourceConnectionForm() {
  const {
    selectedSourceType: sourceType,
    workspaceAccessToken,
    goToSelectObjects: onSourceConnected,
    goBack: onBack,
    sourceConnectLinks = [],
    refetchSourceConnectLinks,
    embedMode = true,
    goBack,
  } = useSourceFlow()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showEmbeddedFrame, setShowEmbeddedFrame] = useState(true)

  // Use the same hook that Source.js uses to manage connect links
  const [sourceConnectLink, getNewSourceConnectLink, isLinkLoading] = useSourceConnectLink(
    sourceConnectLinks,
    sourceType?.service_name,
    workspaceAccessToken,
  )

  // Add useEffect to automatically initiate the flow when component mounts
  useEffect(() => {
    const initiateFlow = async () => {
      try {
        setLoading(true)
        setError(null)

        if (sourceConnectLink) {
          // We already have a source connect link
          initiateSourceConnectFlow(sourceConnectLink)
        } else {
          // We need to create a source connect link
          const newLink = await getNewSourceConnectLink()
          initiateSourceConnectFlow(newLink)
        }
      } catch (err) {
        setError(err.message || "Failed to create connection link")
        setLoading(false)
      }
    }

    initiateFlow()
  })

  const initiateSourceConnectFlow = (sourceConnectLinkData) => {
    if (embedMode) {
      setShowEmbeddedFrame(true)
    } else {
      // For non-embedded mode, redirect to the Census connect page
      window.location.href = sourceConnectLinkData.uri
    }
  }

  const onExitedConnectionFlow = async (connectionDetails) => {
    setLoading(false)

    if (connectionDetails.status === "created") {
      // Connection was successful
      await refetchSourceConnectLinks() // Current sourceConnectLink becomes invalid. Refetch to get a new one.

      // Pass the new source to the parent component
      onSourceConnected({
        id: connectionDetails.details.id,
        type: sourceType.service_name,
        name: connectionDetails.details.name || sourceType.label,
      })
    } else {
      // Connection failed or was cancelled
      setShowEmbeddedFrame(false)
      goBack()
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {error && <div className="rounded bg-red-50 p-4 text-red-500">{error}</div>}

      {showEmbeddedFrame ? (
        <div className="h-full w-full">
          <EmbeddedFrame
            connectLink={sourceConnectLink?.uri}
            onExit={onExitedConnectionFlow}
            className="h-full"
            height="100%"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {loading && (
            <div className="flex items-center justify-center">
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></span>
                Preparing connection...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
