import { useState, useEffect } from "react"

/**
 * Hook for managing entity refresh operations with status polling
 * @param {Object} params
 * @param {Function} params.refreshFn - Async function that performs the refresh and returns refresh_key
 * @param {Function} params.statusFn - Optional async function that checks refresh status, receives refresh_key
 * @param {Function} params.refetchFn - Function to refetch data after refresh
 * @param {boolean} params.autoRefresh - Whether to auto-refresh when data is empty
 * @param {Array|null} params.data - The data array to check for emptiness
 * @param {boolean} params.loading - Whether initial data is loading
 * @param {any} params.error - Error state from initial fetch
 * @param {number} params.pollInterval - Interval in ms between status checks (default: 1000)
 * @param {number} params.maxPolls - Maximum number of status polls (default: 30)
 */
export function useEntityRefresh({
  refreshFn,
  statusFn = null,
  refetchFn,
  autoRefresh = true,
  data = null,
  loading = false,
  error = null,
  pollInterval = 1000,
  maxPolls = 30,
}) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Auto-refresh if no data is available
  useEffect(() => {
    if (autoRefresh && !loading && !error && data && data.length === 0) {
      handleRefresh()
    }
  }, [autoRefresh, loading, error, data])

  const pollForCompletion = async (refreshKey) => {
    let polls = 0
    while (polls < maxPolls) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval))

      try {
        const status = await statusFn(refreshKey)
        console.log("Polled status:", status)

        // Check if refresh is complete based on status response
        if (status?.status === "completed") {
          return true
        } else if (status?.status === "failed" || status?.status === "error") {
          throw new Error(`Refresh failed: ${status?.message || "Unknown error"}`)
        }

        polls++
      } catch (err) {
        console.error("Status polling error:", err)
        throw err
      }
    }

    // If we've exceeded max polls, continue anyway
    console.warn("Max polling attempts reached, proceeding to refetch")
    return false
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const refreshResult = await refreshFn()

      // If statusFn is provided, poll for completion
      if (statusFn) {
        // Extract refresh_key from the refresh result
        const refreshKey = refreshResult?.refresh_key
        if (!refreshKey) {
          console.warn("No refresh_key returned from refreshFn, proceeding without status polling")
          await new Promise((resolve) => setTimeout(resolve, 2000))
        } else {
          await pollForCompletion(refreshKey)
        }
      } else {
        // Fallback to waiting 2 seconds if no status function provided
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      await refetchFn()
    } catch (err) {
      console.error("Refresh error:", err)
    } finally {
      setIsRefreshing(false)
    }
  }

  return {
    isRefreshing,
    handleRefresh,
  }
}
