import Button from "@components/Button/Button/Button"
import Loading from "@components/Loading/Loading"
import Error_ from "@components/Message/Error_"
import { useBasicFetch } from "@utils/fetch"

const OPERATION_LABELS = {
  update: "Update",
  upsert: "Upsert (Update or Insert)",
  insert: "Insert",
  mirror: "Mirror",
  append: "Append",
  delete: "Delete",
}

const OPERATION_DESCRIPTIONS = {
  update: "Update existing records only",
  upsert: "Update existing records or insert new ones",
  insert: "Insert new records only",
  mirror: "Mirror the source data exactly (add, update, delete)",
  append: "Append new records without checking for duplicates",
  delete: "Delete records from destination",
}

export default function SyncBehaviorSelector({
  destinationId,
  destinationObjectFullName,
  workspaceAccessToken,
  onSelect,
  onBack,
}) {
  const {
    loading,
    error,
    data: objectDetails,
  } = useBasicFetch(() => {
    return new Request(
      `/api/fetch_destination_object?destinationId=${destinationId}&objectFullName=${encodeURIComponent(destinationObjectFullName)}`,
      {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
        },
      },
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loading />
      </div>
    )
  }

  if (error) {
    return <Error_ message="Failed to load destination object details" />
  }

  const supportedOperations = objectDetails?.supported_operations || []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button onClick={onBack} className="px-2">
          <i className="fa-solid fa-arrow-left" />
        </Button>
        <h3 className="text-lg font-medium text-neutral-700">Select Sync Behavior</h3>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {supportedOperations.map((operation) => (
          <Button
            key={operation}
            className="flex flex-col items-start justify-start text-left"
            onClick={() => onSelect(operation, objectDetails)}
          >
            <div className="font-medium">{OPERATION_LABELS[operation] || operation}</div>
            <div className="text-xs text-neutral-500">{OPERATION_DESCRIPTIONS[operation]}</div>
          </Button>
        ))}
      </div>
    </div>
  )
}
