import { useState } from "react"

import Button from "@components/Button/Button/Button"
import { useSourceFlow } from "@components/Contexts/SourceFlowContext"
import RequestTooltip from "@components/Tooltip/RequestTooltip"
import SyncCreationWizard from "@components/SyncCreationWizard"
import { SyncObject } from "@components/SyncObject"
import { useSyncManagementLink } from "@hooks/use-sync-management-link"
import { censusBaseUrl } from "@utils/url"

export default function SourceObjectSelection() {
  const {
    selectedSource: source,
    workspaceAccessToken,
    syncs,
    setSyncs,
    refetchSyncs,
    syncManagementLinks,
    refetchSyncManagementLinks,
    runsLoading,
    runs,
    devMode,
    embedMode,
    goToReview,
    goBack,
  } = useSourceFlow()

  const [showCreateSyncWizard, setShowCreateSyncWizard] = useState(false)
  const [loading, setLoading] = useState(false)

  // Filter syncs for this source
  const sourceSpecificSyncs = syncs.filter((sync) => sync.source_attributes.connection_id === source.id)

  // Use the sync management link hook
  const [syncManagementLink, resetSyncManagementLink, isLinkLoading] = useSyncManagementLink(
    syncManagementLinks,
    refetchSyncManagementLinks,
    workspaceAccessToken,
  )

  // Default query parameters for destination
  const createSyncLinkQueryParams = "&destination_hidden=true"
  const editSyncLinkQueryParams = "&destination_hidden=true"

  // Full link with query parameters
  const createLinkWithQueryParams = syncManagementLink?.uri + createSyncLinkQueryParams

  // Initiate the sync wizard flow
  const initiateSyncWizardFlow = () => {
    if (embedMode) {
      setShowCreateSyncWizard(true)
    } else {
      window.location.href = createLinkWithQueryParams
    }
  }

  // Handle completion of object selection
  const handleContinue = () => {
    // Pass the selected syncs to the parent component
    onObjectsSelected(sourceSpecificSyncs)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mt-4 flex flex-col gap-5">
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
          <SyncCreationWizard
            sourceId={source.id}
            setSyncs={setSyncs}
            refetchSyncs={refetchSyncs}
            resetSyncManagementLink={resetSyncManagementLink}
            setShowCreateSyncWizard={setShowCreateSyncWizard}
            linkWithSourcePrepopulated={createLinkWithQueryParams}
          />
        ) : (
          <Button
            className="flex items-center justify-center rounded-md border border-emerald-500/40 bg-neutral-50 px-5 py-8 text-xl shadow-sm"
            onClick={initiateSyncWizardFlow}
            disabled={isLinkLoading}
          >
            <span id={`create-sync-${source?.id}`}>
              <i className="fa-solid fa-plus mr-4" />
              Add data to sync
            </span>
          </Button>
        )}
      </div>

      {/* Request tooltip for developer mode */}
      <RequestTooltip
        anchorSelect={`#create-sync-${source?.id}`}
        url={`${censusBaseUrl}/api/v1/sync_management_links`}
        method="POST"
        devMode={devMode}
        headers={
          <pre>
            {JSON.stringify(
              {
                ["authorization"]: "Bearer <workspaceAccessToken>",
                ["content-type"]: "application/json",
              },
              null,
              2,
            )}
          </pre>
        }
        body={
          !embedMode && (
            <pre>
              {JSON.stringify(
                {
                  redirect_uri: window.location.href,
                },
                null,
                2,
              )}
            </pre>
          )
        }
        link="https://developers.getcensus.com/api-reference/sync-management-links/create-a-new-sync-management-link"
      />
    </div>
  )
}
