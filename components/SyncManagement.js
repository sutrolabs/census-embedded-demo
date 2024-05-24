import React, { useState } from "react"

import Button from "@components/Button"
import RequestTooltip from "@components/RequestTooltip"
import SyncCreationWizard from "@components/SyncCreationWizard"
import { SyncObject } from "@components/SyncObject"
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
  embedSourceFlow,
  addNewSyncText,
  stepText,
  useCase
}) {
  const [showCreateSyncWizard, setShowCreateSyncWizard] = useState(false)
  const [syncManagementLink, resetSyncManagementLink] = useSyncManagementLink(
    syncManagementLinks,
    refetchSyncManagementLinks,
    workspaceAccessToken,
  )
  const linkWithSourcePrepopulated =
    syncManagementLink?.uri + "&form_connection_id=" + sourceId + "&form_source_type=warehouse"

  const initiateSyncWizardFlow = () => {
    if (embedSourceFlow) {
      setShowCreateSyncWizard(true)
    } else {
      window.location.href = linkWithSourcePrepopulated
    }
  }

  return (
    <>
      <p className="text-teal-400">{stepText}</p>
      <div className="flex flex-col gap-5">
        {syncs
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
              embedSourceFlow={embedSourceFlow}
            />
          ))}
        {showCreateSyncWizard ? (
          <SyncCreationWizard
            sourceId={sourceId}
            setSyncs={setSyncs}
            refetchSyncs={refetchSyncs}
            resetSyncManagementLink={resetSyncManagementLink}
            setShowCreateSyncWizard={setShowCreateSyncWizard}
            linkWithSourcePrepopulated={linkWithSourcePrepopulated}
          />
        ) : (useCase === "import" || syncs.length === 0) ? (
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
          !embedSourceFlow && (
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
