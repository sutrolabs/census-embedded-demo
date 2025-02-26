import { useState, useEffect } from "react"

export default function SourceObjectSelection({ source, workspaceAccessToken, onObjectsSelected, onBack }) {
  const [objects, setObjects] = useState([])
  const [selectedObjectIds, setSelectedObjectIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchObjects = async () => {
      setLoading(true)
      setError(null)

      try {
        // This would be replaced with your actual API endpoint for fetching objects
        const response = await fetch(`/api/source_objects?source_id=${source.id}`, {
          headers: {
            ["authorization"]: `Bearer ${workspaceAccessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch objects")
        }

        const data = await response.json()
        setObjects(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (source?.id) {
      fetchObjects()
    }
  }, [source, workspaceAccessToken])

  const toggleObjectSelection = (objectId) => {
    setSelectedObjectIds((prev) =>
      prev.includes(objectId) ? prev.filter((id) => id !== objectId) : [...prev, objectId],
    )
  }

  const handleContinue = () => {
    const selectedObjects = objects.filter((obj) => selectedObjectIds.includes(obj.id))
    onObjectsSelected(selectedObjects)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading objects: {error}</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Select Objects from {source?.name}</h2>
        <button className="rounded border px-3 py-1 text-sm" onClick={onBack}>
          Back
        </button>
      </div>

      {objects.length === 0 ? (
        <div className="p-4 text-gray-500">No objects found for this source.</div>
      ) : (
        <div className="mt-4 divide-y rounded border">
          {objects.map((object) => (
            <div key={object.id} className="flex items-center gap-3 p-4 hover:bg-gray-50">
              <input
                type="checkbox"
                id={`object-${object.id}`}
                checked={selectedObjectIds.includes(object.id)}
                onChange={() => toggleObjectSelection(object.id)}
                className="h-4 w-4"
              />
              <label htmlFor={`object-${object.id}`} className="grow cursor-pointer">
                <div className="font-medium">{object.name}</div>
                <div className="text-sm text-gray-500">{object.type}</div>
              </label>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-between">
        <button className="rounded border px-4 py-2" onClick={onBack}>
          Back
        </button>
        <button
          className="rounded bg-emerald-500 px-4 py-2 text-white"
          onClick={handleContinue}
          disabled={selectedObjectIds.length === 0}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
