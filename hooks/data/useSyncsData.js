import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"

export function useSyncsData() {
  const { syncs, runs, runsLoading } = useCensusEmbedded()

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
