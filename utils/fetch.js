import { useCallback, useEffect, useState } from "react"

export function useBasicFetch(request, options) {
  const [initialRequest] = useState(() => (options?.initial ?? true ? request() : undefined))
  const [loading, setLoading] = useState()
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
