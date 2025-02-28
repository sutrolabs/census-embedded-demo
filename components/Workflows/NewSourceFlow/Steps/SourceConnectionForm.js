import Image from "next/image"
import { useState } from "react"

import EmbeddedFrame from "@components/EmbeddedFrame"
import { useSourceConnectLink } from "@hooks/use-source-connect-link"
import { getLogoForSourceType } from "@hooks/useSourceLogos"

export default function SourceConnectionForm({
  sourceType,
  workspaceAccessToken,
  onSourceConnected,
  onBack,
  sourceConnectLinks = [],
  refetchSourceConnectLinks,
  embedMode = true, // Default to embedded mode for better UX
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showEmbeddedFrame, setShowEmbeddedFrame] = useState(false)

  // Use the same hook that Source.js uses to manage connect links
  const [sourceConnectLink, getNewSourceConnectLink, isLinkLoading] = useSourceConnectLink(
    sourceConnectLinks,
    sourceType?.service_name,
    workspaceAccessToken,
  )

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
    }
  }

  const handleConnect = async () => {
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

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-row items-center gap-2">
        <Image src={getLogoForSourceType(sourceType)} height={30} width={30} alt="" />
        <h2 className="text-xl font-semibold">Connect {sourceType.label}</h2>
      </div>

      {error && <div className="rounded bg-red-50 p-4 text-red-500">{error}</div>}

      {showEmbeddedFrame ? (
        <div className="mb-8 h-full w-full">
          <EmbeddedFrame
            connectLink={sourceConnectLink?.uri}
            onExit={onExitedConnectionFlow}
            className="h-full"
          />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <div className="rounded bg-neutral-50 p-4">
            <p className="mb-2">Connect your {sourceType.label} account to import your data.</p>
            <p className="text-sm text-neutral-600">
              {embedMode
                ? "You'll be guided through a secure connection process."
                : "You'll be redirected to Census to securely connect your account."}
            </p>
          </div>

          <div className="mt-4 flex justify-between">
            <button type="button" className="rounded border px-4 py-2" onClick={onBack} disabled={loading}>
              Back
            </button>
            <button
              type="button"
              className="rounded bg-emerald-500 px-4 py-2 text-white"
              onClick={handleConnect}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Preparing connection...
                </span>
              ) : (
                "Connect with Census"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
