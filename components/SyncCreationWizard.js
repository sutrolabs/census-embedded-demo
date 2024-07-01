import { useEffect, useContext } from "react"
import { Card } from "@components/Card"
import EmbeddedFrame from "@components/EmbeddedFrame"
import { IntegrationsContext } from "contexts/IntegrationsContext"
import { useHideSourceDestination } from "@hooks/use-hide-source-destination"

export default function SyncCreationWizard({
  sourceId,
  setSyncs,
  refetchSyncs,
  resetSyncManagementLink,
  setShowCreateSyncWizard,
  linkWithSourcePrepopulated,
  destination,
}) {
  // useEffect(() => {
  //   set
  // })
  // // const link = formatLinkToHideSourceDestination(linkWithSourcePrepopulated)
  return (
    <Card>
      <EmbeddedFrame
        connectLink={linkWithSourcePrepopulated}
        onExit={async (connectionDetails) => {
          if (connectionDetails.status === "created") {
            setSyncs((syncs) => [
              ...syncs,
              {
                id: connectionDetails.details.id,
                paused: true,
                label: "Loading Sync",
                source_attributes: { connection_id: sourceId },
                mappings: [],
              },
            ])
            await refetchSyncs()
            // prepares a new link for the next sync creation
            await resetSyncManagementLink()
          }
          setShowCreateSyncWizard(false)
        }}
      />
    </Card>
  )
}
