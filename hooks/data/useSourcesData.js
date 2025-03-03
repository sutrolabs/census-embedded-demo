import { useData } from "@providers/DataProvider"

export function useSourcesData() {
  const { sources, sourceConnectLinks } = useData()

  return {
    loading: sources.loading || sourceConnectLinks.loading,
    error: sources.error || sourceConnectLinks.error,
    sources: sources.data || [],
    sourceConnectLinks: sourceConnectLinks.data || [],
    refetchSources: sources.refetchInBackground,
    refetchSourceConnectLinks: sourceConnectLinks.refetchInBackground,
    setSources: sources.setData,
    setSourceConnectLinks: sourceConnectLinks.setData,
  }
}
