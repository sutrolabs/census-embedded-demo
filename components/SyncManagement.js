import Button from "@components/Button/Button/Button"
import SyncCreationWizard from "@components/SyncCreationWizard"
import { SyncObject } from "@components/SyncObject"
import RequestTooltip from "@components/Tooltip/RequestTooltip"
import { useSyncManagementLink } from "@hooks/use-sync-management-link"
import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"
import { censusBaseUrl } from "@utils/url"
import React, { useState } from "react"

export default function SyncManagement({
  sourceId,
  type,

  addNewSyncText,
  stepText,
  useCase,
  createSyncLinkQueryParams,
  editSyncLinkQueryParams,
}) {
  const {
    workspaceAccessToken,
    setSyncs,
    syncs,
    refetchSyncs,
    runs,
    runsLoading,
    devMode,
    embedMode,
    syncManagementLinks,
    refetchSyncManagementLinks,
  } = useCensusEmbedded()

  const [showCreateSyncWizard, setShowCreateSyncWizard] = useState(false)
  const [syncManagementLink, resetSyncManagementLink] = useSyncManagementLink(
    syncManagementLinks,
    refetchSyncManagementLinks,
    workspaceAccessToken,
  )
  const createLinkWithQueryParams = syncManagementLink?.uri + createSyncLinkQueryParams

  const initiateSyncWizardFlow = () => {
    if (embedMode) {
      setShowCreateSyncWizard(true)
    } else {
      window.location.href = createLinkWithQueryParams
    }
  }

  const showAddNewSyncButton = useCase === "import" || syncs.length === 0

  return (
    <>
      <p>{stepText}</p>
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
            queryParams={editSyncLinkQueryParams}
          />
        ))}
        {showCreateSyncWizard ? (
          <SyncCreationWizard
            sourceId={sourceId}
            setSyncs={setSyncs}
            refetchSyncs={refetchSyncs}
            resetSyncManagementLink={resetSyncManagementLink}
            setShowCreateSyncWizard={setShowCreateSyncWizard}
            linkWithSourcePrepopulated={createLinkWithQueryParams}
          />
        ) : showAddNewSyncButton ? (
          <Button
            className="flex items-center justify-center rounded-md border border-emerald-500/40 bg-neutral-50  px-5 py-8 text-xl
              shadow-sm"
            onClick={initiateSyncWizardFlow}
          >
            <span id={`create-sync-${type}`}>
              <i className="fa-solid fa-plus mr-4" />
              {addNewSyncText}
            </span>
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
