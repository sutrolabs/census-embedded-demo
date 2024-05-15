import { useState } from "react"

import Button from "@components/Button"
import EmbeddedFrame from "@components/EmbeddedFrame"
import { SyncObject } from "@components/SyncObject"
import { useSyncManagementLink } from "@hooks/use-sync-management-link"

export default function SyncManagement({
  sourceId,
  syncManagementLinks,
  workspaceAccessToken,
  syncs,
  setSyncs,
  runsLoading,
  runs,
}) {
  const [showCreateSyncWizard, setCreateSyncWizard] = useState(false)
  const [syncManagementLink, resetSyncManagementLink] = useSyncManagementLink(
    syncManagementLinks,
    workspaceAccessToken,
  )

  const SyncCreationWizard = () => {
    return (
      <EmbeddedFrame
        connectLink={
          syncManagementLink.uri + "&form_connection_id=" + sourceId + "&form_source_type=warehouse"
        }
        onExit={(data) => {
          setCreateSyncWizard(false)
        }}
      />
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
              workspaceAccessToken={workspaceAccessToken}
              setSyncs={setSyncs}
              runsLoading={runsLoading}
              runs={runs}
            />
          ))}
        {showCreateSyncWizard ? (
          <SyncCreationWizard />
        ) : (
          <Button
            className="flex items-center justify-center rounded-md border border-indigo-500/40 bg-stone-50  px-5 py-8 text-xl
      shadow-sm"
            onClick={() => setCreateSyncWizard(true)}
          >
            <i className="fa-solid fa-plus mr-4" />
            Create a new sync
          </Button>
        )}
      </div>
    </>
  )
}
