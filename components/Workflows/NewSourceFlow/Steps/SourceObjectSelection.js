import { useState } from "react"

import Button from "@components/Button/Button/Button"
import { SyncObject } from "@components/SyncObject"
import SyncWizard from "@components/SyncWizard/SyncWizard"
import { useSourceFlow } from "@providers/SourceFlowProvider"
import { acmeDestinationServiceName } from "@utils/preset_source_destination"

export default function SourceObjectSelection() {
  const [showCreateSyncWizard, setShowCreateSyncWizard] = useState(false)

  const {
    selectedSource: source,
    workspaceAccessToken,
    syncs,
    setSyncs,
    refetchSyncs,
    runsLoading,
    runs,
    destinations,
    devMode,
    embedMode,
  } = useSourceFlow()

  // Filter syncs for this source
  const sourceSpecificSyncs = syncs.filter((sync) => sync.source_attributes.connection_id === source.id)

  const acmeDestinationId = () => {
    const destination = destinations.find((d) => d.name == acmeDestinationServiceName)

    if (!destination) {
      throw new Error("ACME destination not found")
    }
    return destination.id
  }

  const initiateSyncWizardFlow = () => {
    setShowCreateSyncWizard(true)
  }

  const handleSyncComplete = (newSync) => {
    // Refetch syncs to include the newly created one
    refetchSyncs()
    setShowCreateSyncWizard(false)
  }

  const editSyncLinkQueryParams = {}

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">
      <div className="mt-4 flex h-full flex-col gap-5">
        {/* Display existing syncs */}
        {sourceSpecificSyncs.map((sync) => (
          <SyncObject
            key={sync.id}
            sync={sync}
            refetchSyncs={refetchSyncs}
            workspaceAccessToken={workspaceAccessToken}
            setSyncs={setSyncs}
            runsLoading={runsLoading}
            runs={runs}
            devMode={devMode}
            embedMode={embedMode}
            queryParams={editSyncLinkQueryParams}
          />
        ))}

        {/* Show sync creation wizard or button */}
        {showCreateSyncWizard ? (
          <SyncWizard
            sourceId={source.id}
            destinationId={acmeDestinationId()}
            workspaceAccessToken={workspaceAccessToken}
            onComplete={handleSyncComplete}
          />
        ) : (
          <Button
            className="flex items-center justify-center rounded-md border border-emerald-500/40 bg-neutral-50 px-5 py-8 text-xl shadow-sm"
            onClick={initiateSyncWizardFlow}
          >
            <span id={`create-sync-${source?.id}`}>
              <i className="fa-solid fa-plus mr-4" />
              Add data to sync
            </span>
          </Button>
        )}
      </div>
    </div>
  )
}
