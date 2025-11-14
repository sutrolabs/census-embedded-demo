import { SyncObject } from "@components/SyncObject"
import { useSourceFlow } from "@providers/SourceFlowProvider"

export default function SourceObjectSelection() {
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
    goToReview,
  } = useSourceFlow()

  // Filter syncs for this source
  const sourceSpecificSyncs = syncs.filter((sync) => sync.source_attributes.connection_id === source.id)

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
      </div>
    </div>
  )
}
