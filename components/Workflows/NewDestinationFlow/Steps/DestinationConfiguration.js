import { useState, useEffect } from "react"

import Button from "@components/Button/Button/Button"
import Card from "@components/Card/Card"
import { useDestinationFlow } from "@providers/DestinationFlowProvider"

export default function DestinationConfiguration() {
  const {
    selectedDestination: destination,
    workspaceAccessToken,
    goToReview: onConfigurationComplete,
    goBack: onBack,
  } = useDestinationFlow()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [destinationSettings, setDestinationSettings] = useState(null)

  useEffect(() => {
    const fetchDestinationSettings = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/get_destination_settings?id=${destination.id}`, {
          headers: {
            ["authorization"]: `Bearer ${workspaceAccessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch destination settings")
        }

        const data = await response.json()
        setDestinationSettings(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (destination?.id) {
      fetchDestinationSettings()
    }
  }, [destination?.id, workspaceAccessToken])

  const handleSaveSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/update_destination_settings", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
        body: JSON.stringify({
          id: destination.id,
          settings: destinationSettings,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update destination settings")
      }

      onConfigurationComplete()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded bg-red-50 p-4 text-red-500">
        Error: {error}
        <Button className="mt-4" onClick={onBack}>
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <h3 className="mb-4 text-lg font-medium">Destination Settings</h3>
        {/* Add destination-specific configuration fields here */}
        <p className="text-neutral-600">
          Your destination is connected and ready to use. You can configure additional settings here.
        </p>
      </Card>

      <div className="mt-4 flex justify-between">
        <Button onClick={onBack}>Back</Button>
        <Button onClick={handleSaveSettings} variant="primary" loading={loading}>
          Save and Continue
        </Button>
      </div>
    </div>
  )
}
