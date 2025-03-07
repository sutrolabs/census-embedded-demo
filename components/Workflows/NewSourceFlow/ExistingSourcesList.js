import Image from "next/image"

import { getLogoForSource } from "@hooks/useSourceLogos"

export default function ExistingSourcesList({ sources, loading, error, onSelectSource }) {
  // Filter out sources with the name "embedded-demo"
  const filteredSources = sources.filter((source) => source.name !== "embedded_demo")

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

  if (filteredSources.length === 0) {
    return <div className="p-4 text-neutral-500">No existing sources found.</div>
  }

  return (
    <div className="divide-y rounded border">
      {filteredSources.map((source) => {
        const logo = getLogoForSource(source)
        return (
          <div
            key={source.id}
            className="flex cursor-pointer flex-row gap-3 p-4 hover:bg-neutral-50"
            onClick={() => onSelectSource(source)}
          >
            <Image src={logo} height={20} width={20} alt="" />
            <div className="font-medium">{source.name || source.type}</div>
          </div>
        )
      })}
    </div>
  )
}
