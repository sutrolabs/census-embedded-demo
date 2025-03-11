import humanizeDuration from "humanize-duration"
import { useMemo } from "react"

import { Tag } from "@components/Tag/Tag"

const loadingMode = {
  className: "bg-white border border-neutral-100 text-neutral-700",
  indicatorClassName: "bg-blue-400",
  text: "Loading...",
}

const notConnectedMode = {
  className: "bg-white border border-neutral-100 text-neutral-700",
  indicatorClassName: "bg-neutral-400",
  text: "Not connected",
}

const unknownMode = {
  className: "bg-white border border-neutral-100 text-neutral-700",
  indicatorClassName: "bg-neutral-400",
  text: "Unknown",
}

const modes = [
  {
    status: "running",
    className: "bg-white border border-neutral-100 text-neutral-700",
    indicatorClassName: "bg-emerald-500 animate-pulse",
    text: "Running...",
  },
  {
    status: "pending",
    className: "bg-white border border-neutral-100 text-neutral-700",
    indicatorClassName: "bg-neutral-200",
    text: "Not run yet",
  },
  {
    status: "done",
    className: "bg-white border border-neutral-100 text-neutral-700",
    indicatorClassName: "bg-emerald-500",
    text: "Up to date",
  },
]

export function SyncStatus({ className, syncsLoading, syncs, runsLoading, runs, showAge, ...props }) {
  const [mode, age] = useMemo(() => {
    if (syncsLoading || runsLoading) {
      return [loadingMode, undefined]
    }

    const activeSyncs = syncs.filter((item) => !item.paused)
    if (!activeSyncs.length) {
      return [notConnectedMode, undefined]
    }

    let index = undefined
    let mode = undefined
    let completedAt = undefined
    for (const sync of activeSyncs) {
      const run = runs.find((item) => item.sync_id === sync.id)
      const status = !run ? "pending" : run.completed_at ? "done" : "running"
      const newIndex = modes.findIndex((mode) => mode.status === status)
      const newCompletedAt = run?.completed_at
      if (
        newIndex >= 0 &&
        (index === undefined || newIndex < index || (newIndex === index && newCompletedAt < completedAt))
      ) {
        index = newIndex
        mode = modes[newIndex]
        completedAt = newCompletedAt
      }
    }
    return [mode ?? unknownMode, completedAt ? Date.now() - new Date(completedAt).getTime() : undefined]
  }, [syncsLoading, syncs, runsLoading, runs])

  return (
    <Tag
      indicator={true}
      indicatorClassName={mode.indicatorClassName}
      className={`${mode.className} ${className} max-w-[200px]`}
      text={`${mode.text}${
        showAge && age ? ` (${humanizeDuration(age, { units: ["h", "m"], round: true })} ago)` : ""
      }`}
      {...props}
    />
  )
}
