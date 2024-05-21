import { useState } from "react"

import Button from "@components/Button"
import { Card } from "@components/Card"
import EmbeddedFrame from "@components/EmbeddedFrame"
import { SyncObject } from "@components/SyncObject"
import { useSyncManagementLink } from "@hooks/use-sync-management-link"

export default function SyncManagement({
  sourceId,
  syncManagementLinks,
  refetchSyncManagementLinks,
  workspaceAccessToken,
  syncs,
  setSyncs,
  refetchSyncs,
  runsLoading,
  runs,
  devMode,
  embedSourceFlow,
}) {
  const [showCreateSyncWizard, setShowCreateSyncWizard] = useState(false)
  const [syncManagementLink, resetSyncManagementLink] = useSyncManagementLink(
    syncManagementLinks,
    refetchSyncManagementLinks,
    workspaceAccessToken,
  )

  const linkWithSourcePrepopulated = () => {
    return syncManagementLink.uri + "&form_connection_id=" + sourceId + "&form_source_type=warehouse"
  }

  const initiateSyncWizardFlow = () => {
    if (embedSourceFlow) {
      setShowCreateSyncWizard(true)
    } else {
      window.location.href = linkWithSourcePrepopulated()
    }
  }

  const SyncCreationWizard = () => {
    return (
      <Card>
        <EmbeddedFrame
          connectLink={linkWithSourcePrepopulated()}
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

  return (
    <>
      <p className="text-teal-400">Step 2: Choose which source objects to sync.</p>
      <div className="flex flex-col gap-5">
        {syncs
          .filter((sync) => sync.source_attributes.connection_id === sourceId)
          .map((sync) => (
            <SyncObject
              key={sync.id}
              sync={sync}
              refetchSyncs={refetchSyncs}
              workspaceAccessToken={workspaceAccessToken}
              setSyncs={setSyncs}
              runsLoading={runsLoading}
              runs={runs}
              devMode={devMode}
            />
          ))}
        {showCreateSyncWizard ? (
          <SyncCreationWizard />
        ) : (
          <Button
            className="flex items-center justify-center rounded-md border border-indigo-500/40 bg-stone-50  px-5 py-8 text-xl
      shadow-sm"
            onClick={initiateSyncWizardFlow}
          >
            <i className="fa-solid fa-plus mr-4" />
            Configure data to import
          </Button>
        )}
      </div>
    </>
  )
}
