import { useData } from "@providers/DataProvider"

export function useSyncsData() {
  const { syncs, runs, runsLoading } = useData()

  return {
    loading: syncs.loading,
    error: syncs.error,
    syncs: syncs.data || [],
    runs,
    runsLoading,
    refetchSyncs: syncs.refetchInBackground,
    setSyncs: syncs.setData,
  }
}
