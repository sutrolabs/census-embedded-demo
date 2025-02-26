import Image from "next/image"

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

  const { source_connection_logos } = require("@components/Data/Connections/source-connection-logos")

  const getLogoForSourceType = (sourceType) => {
    const logoEntry = source_connection_logos.find(
      (logo) => logo.label.toLowerCase() === sourceType.service_name.toLowerCase(),
    )
    return logoEntry ? logoEntry.logo : null
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Select a Source Type</h2>
        <button className="rounded border px-3 py-1 text-sm" onClick={onBack}>
          Back
        </button>
      </div>
      <div className="h-full overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 py-8">
          {sourceTypes.map((sourceType) => {
            const logo = getLogoForSourceType(sourceType)

            return (
              <div
                key={sourceType.service_name}
                className="cursor-pointer rounded border p-4 hover:bg-gray-50"
                onClick={() => onSelectSourceType(sourceType)}
              >
                <div className="flex items-center gap-3">
                  {logo && (
                    <Image
                      src={logo}
                      alt={`${sourceType.label} logo`}
                      width={50}
                      height={50}
                      className="h-8 w-8 object-contain"
                    />
                  )}
                  <div className="font-medium">{sourceType.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
