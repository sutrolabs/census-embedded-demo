import { useCallback, useEffect, useRef, useState } from "react"

export function useBasicFetch(request, options) {
  const [initialRequest] = useState(() => (options?.initial ?? true ? request() : undefined))
  const [loading, setLoading] = useState(options?.initial ?? true)
  const [error, setError] = useState()
  const [data, setData] = useState()
  const run = useCallback(async (currentRequest) => {
    try {
      setLoading(true)
      const response = await fetch(currentRequest)
      if (!response.ok) {
        throw new Error(response.statusText)
      }

      setData(await response.json())
      setError()
      setLoading(false)
    } catch (error) {
      setData()
      setError(error)
      setLoading(false)
    }
  }, [])
  const refetch = useCallback(() => run(request()), [run, request])

  useEffect(() => {
    if (initialRequest) {
      run(initialRequest)
    }
  }, [run, initialRequest])

  return { loading, error, setError, data, setData, refetch }
}

export function useFetchRuns(personalAccessToken, workspaceId, syncsLoading, syncs) {
  const [runsError, setRunsError] = useState()
  const [runsLoading, setRunsLoading] = useState(true)
  const [runs, setRuns] = useState([])
  const fetches = useRef()
  if (!fetches.current) {
    fetches.current = new Map()
  }

  useEffect(() => {
    if (syncsLoading) {
      return
    } else if (!syncs.length) {
      setRunsLoading(false)
      return
    }
    for (const sync of syncs) {
      const { updatedAt } = fetches.current.get(sync.id) ?? {}
      if (!updatedAt || updatedAt < sync.updated_at) {
        fetches.current.set(sync.id, { updatedAt: sync.updated_at, done: false })
        ;(async (sync) => {
          try {
            while (true) {
              const response = await fetch(
                `/api/get_latest_sync_run?workspaceId=${workspaceId}&syncId=${sync.id}`,
                {
                  method: "GET",
                  headers: {
                    ["authorization"]: `Bearer ${personalAccessToken}`,
                  },
                },
              )
              if (!response.ok) {
                throw new Error(response.statusText)
              }
              const data = await response.json()
              fetches.current.set(sync.id, { updatedAt: sync.updated_at, done: true })
              if ([...fetches.current.values()].every(({ done }) => done)) {
                setRunsLoading(false)
              }
              if (data) {
                setRuns((runs) => [...runs.filter((run) => run.sync_id !== sync.id), data])
                if (data.completed_at) {
                  break
                }
              } else {
                break
              }
              await new Promise((resolve) => setTimeout(resolve, 1000))
            }
          } catch (error) {
            setRunsError(error)
          }
        })(sync)
      }
    }
  }, [personalAccessToken, workspaceId, syncsLoading, syncs])

  return { runsError, runsLoading, runs }
}
