import Button from "@components/Button/Button/Button"
import Loading from "@components/Loading/Loading"
import Error_ from "@components/Message/Error_"
import RefreshButton from "@components/SyncWizard/RefreshButton"
import { useEntityRefresh } from "@hooks/useEntityRefresh"
import { useBasicFetch } from "@utils/fetch"

export default function DestinationObjectSelector({ destinationId, workspaceAccessToken, onSelect, onBack }) {
  const {
    loading,
    error,
    data: objects,
    refetch,
  } = useBasicFetch(() => {
    return new Request(`/api/list_destination_objects?destinationId=${destinationId}`, {
      method: "GET",
      headers: {
        ["authorization"]: `Bearer ${workspaceAccessToken}`,
      },
    })
  })

  const { isRefreshing, handleRefresh } = useEntityRefresh({
    refreshFn: async () => {
      const response = await fetch("/api/refresh_destination_objects", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
        body: JSON.stringify({ destinationId }),
      })

      if (!response.ok) {
        throw new Error("Failed to refresh destination objects")
      }

      return await response.json()
    },
    statusFn: async (refreshKey) => {
      const response = await fetch(
        `/api/get_refresh_objects_status?destinationId=${destinationId}&refresh_key=${encodeURIComponent(
          refreshKey,
        )}`,
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
    data: objects,
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
    return <Error_ message="Failed to load destination objects" />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button onClick={onBack} className="px-2">
          <i className="fa-solid fa-arrow-left" />
        </Button>
        <div className="flex flex-1 items-center justify-between">
          <h3 className="text-lg font-medium text-neutral-700">Select a Destination Object</h3>
          <RefreshButton onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        </div>
      </div>

      {isRefreshing ? (
        <div className="flex items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 py-12">
          <div className="flex flex-col items-center gap-3">
            <Loading />
            <p className="text-sm text-neutral-600">Refreshing destination objects...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {objects?.map((object) => (
            <Button
              key={object.full_name}
              className="flex flex-col items-start justify-start text-left"
              onClick={() => onSelect(object)}
            >
              <div className="font-medium">{object.label}</div>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
