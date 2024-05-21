import React, { useState } from "react"

import Button from "@components/Button"
import SyncCreationWizard from "@components/SyncCreationWizard"
import { SyncObject } from "@components/SyncObject"

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
}) {
  const [showCreateSyncWizard, setShowCreateSyncWizard] = useState(false)

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
            />
          ))}
        {showCreateSyncWizard ? (
          <SyncCreationWizard
            sourceId={sourceId}
            syncManagementLinks={syncManagementLinks}
            refetchSyncManagementLinks={refetchSyncManagementLinks}
            workspaceAccessToken={workspaceAccessToken}
          />
        ) : (
          <Button
            className="flex items-center justify-center rounded-md border border-indigo-500/40 bg-stone-50  px-5 py-8 text-xl
      shadow-sm"
            onClick={() => setShowCreateSyncWizard(true)}
          >
            <i className="fa-solid fa-plus mr-4" />
            Configure data to import
          </Button>
        )}
      </div>
    </>
  )
}
