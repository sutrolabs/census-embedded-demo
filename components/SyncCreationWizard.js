import EmbeddedFrame from "@components/EmbeddedFrame"
import { useSyncManagementLink } from "@hooks/use-sync-management-link"

export default function SyncCreationWizard({
  sourceId,
  syncManagementLinks,
  refetchSyncManagementLinks,
  workspaceAccessToken,
}) {
  const [syncManagementLink, resetSyncManagementLink] = useSyncManagementLink(
    syncManagementLinks,
    refetchSyncManagementLinks,
    workspaceAccessToken,
  )
  return (
    <EmbeddedFrame
      connectLink={syncManagementLink.uri + "&form_connection_id=" + sourceId + "&form_source_type=warehouse"}
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
  )
}
