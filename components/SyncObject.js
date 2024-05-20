import { useState } from "react"

import Button from "@components/Button"
import { Card } from "@components/Card"
import { SyncStatus } from "@components/SyncStatus"
import Toggle from "@components/Toggle"

export function SyncObject({ workspaceAccessToken, sync, setSyncs, refetchSyncs, runsLoading, runs }) {
  const [loading, setLoading] = useState(false)
  const [disabledOverride, setDisabledOverride] = useState()
  const run = runs.find((item) => item.sync_id === sync?.id)
  const running = run ? !run.completed_at : false
  const disabled = disabledOverride ?? sync?.paused ?? true

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

  const pauseSync = async () => {
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
    <Card className="flex flex-col gap-4" disabled={disabled}>
      <h4 className="flex flex-row justify-between">
        <span className="font-medium">{sync.label ?? `Sync: ${sync.id}`}</span>
        <div className="flex flex-row items-center gap-2">
          <Toggle checked={!disabled} disabled={loading || running} onChange={pauseSync} />
          <Button onClick={deleteSync}>
            <i className="fa-solid fa-trash" />
          </Button>
        </div>
      </h4>
      <p className="-mb-2 text-sm">These attributes will get synced...</p>
      <ul className="ml-6 flex grow list-disc flex-col gap-1 text-sm">
        {sync.mappings.map((mapping) => (
          <li key={mapping.from.data}>{mapping.from.data}</li>
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
          <Button className="text-sm" disabled={disabled || loading || running} onClick={runSync}>
            <i className="fa-solid fa-play mr-2" />
            Run now
          </Button>
          <Button className="text-sm" disabled={disabled || loading || running}>
            <i className="fa-solid fa-gear mr-2" />
            Configure
          </Button>
        </div>
      </div>
    </Card>
  )
}
