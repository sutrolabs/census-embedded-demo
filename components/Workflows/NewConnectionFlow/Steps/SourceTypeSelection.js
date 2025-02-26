export default function SourceTypeSelection({ sourceTypes, loading, error, onSelectSourceType, onBack }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading source types: {error}</div>
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Select a Source Type</h2>
        <button className="rounded border px-3 py-1 text-sm" onClick={onBack}>
          Back
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {sourceTypes.map((sourceType) => (
          <div
            key={sourceType.service_name}
            className="cursor-pointer rounded border p-4 hover:bg-gray-50"
            onClick={() => onSelectSourceType(sourceType)}
          >
            <div className="font-medium">{sourceType.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
