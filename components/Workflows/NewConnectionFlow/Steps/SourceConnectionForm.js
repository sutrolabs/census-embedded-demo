import { useState, useEffect } from "react"

export default function SourceConnectionForm({
  sourceType,
  workspaceAccessToken,
  onSourceConnected,
  onBack,
}) {
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [connectLink, setConnectLink] = useState(null)

  // Create a source connect link when the component mounts
  useEffect(() => {
    const createSourceConnectLink = async () => {
      if (!sourceType) return

      setConnecting(true)
      setError(null)

      try {
        const response = await fetch("/api/create_source_connect_link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ["authorization"]: `Bearer ${workspaceAccessToken}`,
          },
          body: JSON.stringify({
            type: sourceType.service_name,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to create source connect link")
        }

        const data = await response.json()
        setConnectLink(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setConnecting(false)
      }
    }

    createSourceConnectLink()
  }, [sourceType, workspaceAccessToken])

  // Handle the redirect to the connect link
  const handleConnect = () => {
    if (connectLink?.url) {
      // Store any necessary state in localStorage or sessionStorage
      // to handle the redirect back from Census
      sessionStorage.setItem(
        "pendingSourceConnection",
        JSON.stringify({
          sourceType: sourceType.service_name,
          timestamp: Date.now(),
        }),
      )

      // Redirect to the Census connect link
      window.location.href = connectLink.url
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Connect {sourceType.label}</h2>
        <button className="rounded border px-3 py-1 text-sm" onClick={onBack}>
          Back
        </button>
      </div>

      {error && <div className="rounded bg-red-50 p-4 text-red-500">{error}</div>}

      <div className="mt-4 flex flex-col gap-4">
        <div className="rounded bg-gray-50 p-4">
          <p className="mb-2">
            You&apos;ll be redirected to Census to securely connect your {sourceType.label} account.
          </p>
          <p className="text-sm text-gray-600">
            After connecting, you&apos;ll be returned to this application to continue the setup process.
          </p>
        </div>

        <div className="mt-4 flex justify-between">
          <button type="button" className="rounded border px-4 py-2" onClick={onBack} disabled={connecting}>
            Back
          </button>
          <button
            type="button"
            className="rounded bg-emerald-500 px-4 py-2 text-white"
            onClick={handleConnect}
            disabled={connecting || !connectLink}
          >
            {connecting ? (
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
    </div>
  )
}
