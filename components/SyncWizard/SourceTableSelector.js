import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/Command/command"
import Loading from "@components/Loading/Loading"
import Error_ from "@components/Message/Error_"
import RefreshButton from "@components/SyncWizard/RefreshButton"
import { useEntityRefresh } from "@hooks/useEntityRefresh"
import { useBasicFetch } from "@utils/fetch"

export default function SourceTableSelector({ sourceId, workspaceAccessToken, onSelect }) {
  const {
    loading,
    error,
    data: tables,
    refetch,
  } = useBasicFetch(() => {
    return new Request(`/api/list_source_tables?sourceId=${sourceId}`, {
      method: "GET",
      headers: {
        ["authorization"]: `Bearer ${workspaceAccessToken}`,
      },
    })
  })

  const { isRefreshing, handleRefresh } = useEntityRefresh({
    refreshFn: async () => {
      const response = await fetch("/api/refresh_source_tables", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
        body: JSON.stringify({ sourceId }),
      })

      if (!response.ok) {
        throw new Error("Failed to refresh tables")
      }

      return await response.json()
    },
    statusFn: async (refreshKey) => {
      const response = await fetch(
        `/api/get_refresh_tables_status?sourceId=${sourceId}&refresh_key=${encodeURIComponent(refreshKey)}`,
        {
          method: "GET",
          headers: {
            ["authorization"]: `Bearer ${workspaceAccessToken}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to get refresh status")
      }

      return await response.json()
    },
    refetchFn: refetch,
    data: tables,
    loading,
    error,
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loading />
      </div>
    )
  }

  if (error) {
    return <Error_ message="Failed to load source tables" />
  }

  // Group tables by schema
  const tablesBySchema = tables?.reduce((acc, table) => {
    const schema = table.table_schema
    if (!acc[schema]) {
      acc[schema] = []
    }
    acc[schema].push(table)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-neutral-700">Select a Source Table</h3>
        <RefreshButton onRefresh={handleRefresh} isRefreshing={isRefreshing} />
      </div>

      {isRefreshing ? (
        <div className="flex items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 py-12">
          <div className="flex flex-col items-center gap-3">
            <Loading />
            <p className="text-sm text-neutral-600">Refreshing tables...</p>
          </div>
        </div>
      ) : (
        <Command className="rounded-lg border border-neutral-200 shadow-md">
          <CommandInput placeholder="Search tables..." />
          <CommandList>
            <CommandEmpty>No tables found.</CommandEmpty>
            {Object.entries(tablesBySchema || {}).map(([schema, schemaTables]) => (
              <CommandGroup key={schema} heading={schema}>
                {schemaTables.map((table) => (
                  <CommandItem
                    key={`${table.table_schema}.${table.table_name}`}
                    value={`${table.table_schema}.${table.table_name}`}
                    onSelect={() => onSelect(table)}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <div className="font-medium">{table.table_name}</div>
                      <div className="text-xs text-neutral-400">{table.table_schema}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      )}
    </div>
  )
}
