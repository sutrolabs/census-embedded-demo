import { useMemo } from "react"

import { Tag } from "@components/Tag"

const loadingMode = {
  className: "bg-stone-100 text-stone-300",
  text: "Loading...",
}

const notConnectedMode = {
  className: "bg-stone-200 text-stone-400",
  text: "Not connected",
}

const unknownMode = {
  className: "bg-stone-200 text-stone-900",
  text: "Unknown",
}

const modes = [
  {
    status: "running",
    className: "bg-emerald-500 text-emerald-50",
    text: "Running",
  },
  {
    status: "pending",
    className: "bg-stone-300 text-stone-50",
    text: "Pending",
  },
  {
    status: "done",
    className: "bg-emerald-200 text-emerald-700",
    text: "Up to date",
  },
]

export function SyncStatus({ className, syncsLoading, syncs, runsLoading, runs }) {
  const mode = useMemo(() => {
    if (syncsLoading || runsLoading) {
      return loadingMode
    }

    const activeSyncs = syncs.filter((item) => !item.paused)
    if (!activeSyncs.length) {
      return notConnectedMode
    }

    let index = undefined
    let mode = undefined
    for (const sync of activeSyncs) {
      const run = runs.find((item) => item.sync_id === sync.id)
      const status = !run ? "pending" : run.completed_at ? "done" : "running"
      const newIndex = modes.findIndex((mode) => mode.status === status)
      if (newIndex >= 0 && (index === undefined || newIndex < index)) {
        index = newIndex
        mode = modes[newIndex]
      }
    }
    return mode ?? unknownMode
  }, [syncsLoading, syncs, runsLoading, runs])
  return <Tag className={`${mode.className} ${className}`} text={mode.text} />
}
