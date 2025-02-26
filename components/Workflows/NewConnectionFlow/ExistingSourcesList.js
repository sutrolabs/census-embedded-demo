export default function ExistingSourcesList({ sources, loading, error, onSelectSource }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading sources: {error}</div>
  }

  if (sources.length === 0) {
    return <div className="p-4 text-gray-500">No existing sources found.</div>
  }

  return (
    <div className="divide-y rounded border">
      {sources.map((source) => (
        <div
          key={source.id}
          className="cursor-pointer p-4 hover:bg-gray-50"
          onClick={() => onSelectSource(source)}
        >
          <div className="font-medium">{source.name}</div>
          <div className="text-sm text-gray-500">{source.type}</div>
        </div>
      ))}
    </div>
  )
}
