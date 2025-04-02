import { useState, useEffect } from "react"

import Button from "@components/Button/Button/Button"
import SyncCreationWizard from "@components/SyncCreationWizard"
import { SyncObject } from "@components/SyncObject"
import RequestTooltip from "@components/Tooltip/RequestTooltip"
import { useSyncManagementLink } from "@hooks/use-sync-management-link"
import { useSourceFlow } from "@providers/SourceFlowProvider"
import { acmeDestinationServiceName, acmeDestinationObjectName } from "@utils/preset_source_destination"
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
    destinations,
    devMode,
    embedMode,
    goToReview,
    goBack,
  } = useSourceFlow()

  const [showCreateSyncWizard, setShowCreateSyncWizard] = useState(false)
  const [loading, setLoading] = useState(false)
  const [presetDestination, setPresetDestination] = useState(null)

  useEffect(() => {
    // The custom ACME connector is required to have a unique type upon creation
    // Therefore, we check by the name as it is more consistent across different connectors
    setPresetDestination(destinations.find((d) => d.name == acmeDestinationServiceName))
  }, [destinations])

  // The Source component is only called from ImportDataset
  // When importing datasets, the destination will always be our application, aka ACME
  const prefillDestination = (edit = false) => {
    if (!presetDestination?.id) return ""

    let queryParams = "&destination_hidden=true"

    if (!edit) {
      queryParams += `&destination_connection_id=${presetDestination.id}&destination_object_name=${acmeDestinationObjectName}`
    }

    return queryParams
  }

  // Filter syncs for this source
  const sourceSpecificSyncs = syncs.filter((sync) => sync.source_attributes.connection_id === source.id)

  // Use the sync management link hook
  const [syncManagementLink, resetSyncManagementLink, isLinkLoading] = useSyncManagementLink(
    syncManagementLinks,
    refetchSyncManagementLinks,
    workspaceAccessToken,
  )

  // Default query parameters for destination
  const createSyncLinkQueryParams = prefillDestination(false)
  const editSyncLinkQueryParams = prefillDestination(true)

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
    goToReview(sourceSpecificSyncs)
  }

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
