import { useState } from "react"

import Button from "@components/Button/Button/Button"
import Card from "@components/Card/Card"
import EmbeddedFrame from "@components/EmbeddedFrame/EmbeddedFrame"
import { useDestinationFlow } from "@providers/DestinationFlowProvider"

export default function DestinationConfiguration() {
  const {
    selectedDestination: destination,
    workspaceAccessToken,
    goToReview: onConfigurationComplete,
    goBack: onBack,
    selectedSegment,
    setSyncs,
    assembleSyncManagementLink,
  } = useDestinationFlow()

  const [showSyncWizard, setShowSyncWizard] = useState(true)
  const [error, setError] = useState(null)

  const syncLink = assembleSyncManagementLink()

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

  if (syncLink) {
    return (
      <EmbeddedFrame
        connectLink={syncLink}
        height="100%"
        // onExit={async (connectionDetails) => {
        //   if (connectionDetails.status === "created") {
        //     setSyncs((syncs) => [
        //       ...syncs,
        //       {
        //         id: connectionDetails.details.id,
        //         paused: true,
        //         label: "Loading Sync",
        //         source_attributes: { connection_id: sourceId },
        //         mappings: [],
        //       },
        //     ])
        //     await refetchSyncs()
        //     // prepares a new link for the next sync creation
        //     await resetSyncManagementLink()
        //   }
        // }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <h3 className="mb-4 text-lg font-medium">Configure Sync</h3>
        <p className="mb-4 text-neutral-600">
          Configure how your segment data will sync to {destination.name}.
        </p>
        <Button variant="primary" onClick={() => setShowSyncWizard(true)}>
          Configure Sync
        </Button>
      </Card>

      <div className="mt-4 flex justify-between">
        <Button onClick={onBack}>Back</Button>
      </div>
    </div>
  )
}
