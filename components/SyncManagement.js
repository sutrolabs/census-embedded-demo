import React, { useState } from "react"

import Button from "@components/Button"
import RequestTooltip from "@components/RequestTooltip"
import SyncCreationWizard from "@components/SyncCreationWizard"
import { SyncObject } from "@components/SyncObject"
import { usePrepopulateHideSourceDestination } from "@hooks/use-prepopulate-hide-source-destination"
import { useSyncManagementLink } from "@hooks/use-sync-management-link"
import { censusBaseUrl } from "@utils/url"

export default function SyncManagement({
  sourceId,
  type,
  syncManagementLinks,
  refetchSyncManagementLinks,
  workspaceAccessToken,
  syncs,
  setSyncs,
  refetchSyncs,
  runsLoading,
  runs,
  devMode,
  embedMode,
  addNewSyncText,
  stepText,
  useCase,
  destination,
}) {
  const [showCreateSyncWizard, setShowCreateSyncWizard] = useState(false)
  const [syncManagementLink, resetSyncManagementLink] = useSyncManagementLink(
    syncManagementLinks,
    refetchSyncManagementLinks,
    workspaceAccessToken,
  )

  const initiateSyncWizardFlow = () => {
    if (embedMode) {
      setShowCreateSyncWizard(true)
    } else {
      window.location.href = linkWithSourceDestinationQueryParams
    }
  }

  const formatLinkToPrepopulateHideSourceDestination = usePrepopulateHideSourceDestination()

  const formatSyncManagementLink = (link, editMode = false) => {
    const formattedLink = formatLinkToPrepopulateHideSourceDestination(link, editMode)

    let linkWithSourceDestinationQueryParams = formattedLink

    // If a destination is passed to the component as opposed to being set in the Integrations context
    // it is because there are multiple destinations being displayed on the page, and a global destination
    // state cannot be set
    if (destination && destination.id) {
      linkWithSourceDestinationQueryParams += `&destination_connection_id=${destination.id}&destination_hidden=true`

      if (destination.name == "Facebook Ads") {
        linkWithSourceDestinationQueryParams += "&destination_object_name=customer"
      } else if (destination.name == "Google Ads") {
        linkWithSourceDestinationQueryParams += "&destination_object_name=user_data"
      }
    }
    return linkWithSourceDestinationQueryParams
  }

  const linkWithSourceDestinationQueryParams = formatSyncManagementLink(syncManagementLink?.uri)
  const showAddNewSyncButton = useCase === "import" || syncs.length === 0

  return (
    <>
      <p className="text-teal-400">{stepText}</p>
      <div className="flex flex-col gap-5">
        {syncs.map((sync) => (
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
            formatSyncManagementLink={formatSyncManagementLink}
          />
        ))}
        {showCreateSyncWizard ? (
          <SyncCreationWizard
            sourceId={sourceId}
            setSyncs={setSyncs}
            refetchSyncs={refetchSyncs}
            resetSyncManagementLink={resetSyncManagementLink}
            setShowCreateSyncWizard={setShowCreateSyncWizard}
            linkWithSourcePrepopulated={linkWithSourceDestinationQueryParams}
          />
        ) : showAddNewSyncButton ? (
          <Button
            className="flex items-center justify-center rounded-md border border-indigo-500/40 bg-stone-50  px-5 py-8 text-xl
              shadow-sm"
            onClick={initiateSyncWizardFlow}
          >
            <a id={`create-sync-${type}`}>
              <i className="fa-solid fa-plus mr-4" />
              {addNewSyncText}
            </a>
          </Button>
        ) : null}
      </div>

      <RequestTooltip
        anchorSelect={`#create-sync-${type}`}
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
    </>
  )
}
