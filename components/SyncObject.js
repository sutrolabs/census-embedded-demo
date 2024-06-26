import { useState } from "react"

import Button from "@components/Button"
import { Card } from "@components/Card"
import RequestTooltip from "@components/RequestTooltip"
import SyncEditWizard from "@components/SyncEditWizard"
import { SyncStatus } from "@components/SyncStatus"
import Toggle from "@components/Toggle"
import { censusBaseUrl } from "@utils/url"
import { useHideSourceDestination } from "@hooks/use-hide-source-destination"

export function SyncObject({
  workspaceAccessToken,
  sync,
  setSyncs,
  refetchSyncs,
  runsLoading,
  runs,
  devMode,
  embedMode,
}) {
  const formatLinkToHideSourceDestination = useHideSourceDestination()
  const [loading, setLoading] = useState(false)
  const [disabledOverride, setDisabledOverride] = useState()
  const [editSyncWizardLink, setEditSyncWizardLink] = useState(null)
  const run = runs.find((item) => item.sync_id === sync?.id)
  const running = run ? !run.completed_at : false
  const disabled = disabledOverride ?? sync?.paused ?? true
  const showEditSyncWizard = !!editSyncWizardLink

  const runSync = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/trigger_sync_run", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
        body: JSON.stringify({
          syncId: sync.id,
        }),
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      setSyncs((syncs) =>
        syncs.map((item) => (item.id === sync.id ? { ...sync, updated_at: new Date().toISOString() } : item)),
      )
      await refetchSyncs()
    } finally {
      setLoading(false)
    }
  }

  const initiateEditSyncWizard = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/create_edit_sync_management_link", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
        body: JSON.stringify({
          syncId: sync.id,
        }),
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const data = await response.json()
      if (embedMode) {
        setEditSyncWizardLink(formatLinkToHideSourceDestination(data.uri))
      } else {
        window.location.href = formatLinkToHideSourceDestination(data.uri)
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteSync = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/delete_sync", {
        method: "DELETE",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
        body: JSON.stringify({
          id: sync.id,
        }),
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      setSyncs((syncs) => syncs.filter((item) => item.id !== sync.id))
      await refetchSyncs()
    } finally {
      setLoading(false)
      setDisabledOverride()
    }
  }

  const toggleSync = async () => {
    try {
      setLoading(true)
      setDisabledOverride(!sync.paused)
      const response = await fetch("/api/set_sync_paused", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
        body: JSON.stringify({
          id: sync.id,
          paused: !sync.paused,
        }),
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const data = await response.json()
      setSyncs((syncs) => syncs.map((item) => (item.id === sync.id ? data : item)))
      await refetchSyncs()
    } finally {
      setLoading(false)
      setDisabledOverride()
    }
  }

  return (
    <>
      <Card className="flex flex-col gap-4" disabled={disabled}>
        <h4 className="flex flex-row justify-between">
          <span className="font-medium">{sync.label ?? `Sync: ${sync.id}`}</span>
          {!showEditSyncWizard && (
            <div className="flex flex-row items-center gap-2">
              <a id={`toggle-${sync.id}`}>
                <Toggle checked={!disabled} disabled={loading || running} onChange={toggleSync} />
              </a>
              <a id={`delete-${sync.id}`}>
                <Button onClick={deleteSync}>
                  <i className="fa-solid fa-trash" />
                </Button>
              </a>
            </div>
          )}
        </h4>
        {showEditSyncWizard ? (
          <SyncEditWizard
            connectLink={editSyncWizardLink}
            closeSyncWizard={() => setEditSyncWizardLink(null)}
            refetchSyncs={refetchSyncs}
          />
        ) : (
          <div>
            <p className="mb-2 text-sm">These attributes will get synced...</p>
            <ul className="ml-6 flex grow list-disc flex-col gap-1 text-sm">
              {sync.mappings.map((mapping) => (
                <li key={mapping.to}>
                  <a id={`mappings-${sync.id}-${mapping.to}`}>{mapping.to}</a>
                </li>
              ))}
            </ul>
            <div className="flex flex-row items-center justify-between gap-2">
              <SyncStatus
                syncsLoading={false}
                syncs={[sync].filter(Boolean)}
                runsLoading={runsLoading}
                runs={runs}
                showAge
              />
              <div className="flex flex-row gap-3">
                <a id={`run-${sync.id}`}>
                  <Button className="text-sm" disabled={disabled || loading || running} onClick={runSync}>
                    <i className="fa-solid fa-play mr-2" />
                    Run now
                  </Button>
                </a>
                <a id={`configure-${sync.id}`}>
                  <Button
                    className="text-sm"
                    disabled={disabled || loading || running}
                    onClick={initiateEditSyncWizard}
                  >
                    <i className="fa-solid fa-gear mr-2" />
                    Configure
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </Card>

      <RequestTooltip
        devMode={devMode}
        anchorSelect={`#run-${sync.id}`}
        url={`${censusBaseUrl}/api/v1/syncs/${sync.id}/trigger`}
        method="POST"
        headers={
          <pre>
            {JSON.stringify(
              {
                ["authorization"]: "Bearer <workspaceAccessToken>",
              },
              null,
              2,
            )}
          </pre>
        }
        link="https://developers.getcensus.com/api-reference/syncs/trigger-a-sync-run"
      />
      <RequestTooltip
        devMode={devMode}
        anchorSelect={`#delete-${sync.id}`}
        url={`${censusBaseUrl}/api/v1/syncs/${sync.id}`}
        method="DELETE"
        headers={
          <pre>
            {JSON.stringify(
              {
                ["authorization"]: "Bearer <workspaceAccessToken>",
              },
              null,
              2,
            )}
          </pre>
        }
        link="https://developers.getcensus.com/api-reference/syncs/delete-a-sync"
      />
      <RequestTooltip
        devMode={devMode}
        anchorSelect={`#configure-${sync.id}`}
        url={`${censusBaseUrl}/api/v1/syncs/${sync.id}/connect_links`}
        method="POST"
        headers={
          <pre>
            {JSON.stringify(
              {
                ["authorization"]: "Bearer <workspaceAccessToken>",
              },
              null,
              2,
            )}
          </pre>
        }
        link="https://developers.getcensus.com/api-reference/sync-management-links/create-sync-management-link-to-edit-sync"
        body={
          embedMode ? null : (
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
      />
      <RequestTooltip
        devMode={devMode}
        anchorSelect={`#toggle-${sync.id}`}
        url={`${censusBaseUrl}/api/v1/syncs/${sync.id}`}
        method="PATCH"
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
          <pre>
            {JSON.stringify(
              {
                ["paused"]: !sync.paused,
              },
              null,
              2,
            )}
          </pre>
        }
        link="https://developers.getcensus.com/api-reference/syncs/update-a-sync"
      />
      <RequestTooltip
        devMode={devMode}
        anchorSelect={`[id^=mappings-${sync.id}]`}
        url={`${censusBaseUrl}/api/v1/syncs/${sync.id}`}
        method="GET"
        headers={
          <pre>
            {JSON.stringify(
              {
                ["authorization"]: "Bearer <workspaceAccessToken>",
              },
              null,
              2,
            )}
          </pre>
        }
        note="This will return the details of the entire sync object. To get only the mappings, you can filter the response by the 'data.mappings' attribute."
        link="https://developers.getcensus.com/api-reference/syncs/fetch-sync"
      />
    </>
  )
}
