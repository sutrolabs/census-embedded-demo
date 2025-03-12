import Image from "next/image"

import Button from "@components/Button/Button/Button"
import { getLogoForDestinationType, getCategoryForDestinationType } from "@hooks/useDestinationLogos"
import { useDestinationFlow } from "@providers/DestinationFlowProvider"

export default function DestinationTypeSelection() {
  const {
    availableDestinationTypes: destinationTypes,
    loadingDestinationTypes: loading,
    error,
    goToConnectDestination: onSelectDestinationType,
    goBack: onBack,
  } = useDestinationFlow()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading destination types: {error}
        <Button className="mt-4" onClick={onBack}>
          Go Back
        </Button>
      </div>
    )
  }

  // Filter out any destination types that shouldn't be shown
  // Similar to source types, we might want to exclude certain destinations
  const excludedDestinations = ["internal", "test"]
  const filteredDestinationTypes = destinationTypes.filter(
    (destinationType) =>
      !excludedDestinations.includes(destinationType.service_name) &&
      destinationType.creatable_via_connect_link === true &&
      getLogoForDestinationType(destinationType) !== null,
  )

  // Group destinations by category
  const groupedDestinations = filteredDestinationTypes.reduce((acc, destination) => {
    const category = getCategoryForDestinationType(destination)
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(destination)
    return acc
  }, {})

  // Sort categories with "Popular" first, then alphabetically
  const sortedCategories = Object.keys(groupedDestinations).sort((a, b) => {
    if (a === "Popular") return -1
    if (b === "Popular") return 1
    return a.localeCompare(b)
  })

  return (
    <div className="flex flex-col gap-6 overflow-y-auto">
      {sortedCategories.map((category) => (
        <div key={category} className="flex flex-col gap-3">
          <h3 className="text-lg font-medium capitalize text-neutral-700">{category}</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {groupedDestinations[category].map((destinationType) => {
              const logo = getLogoForDestinationType(destinationType)
              return (
                <div
                  key={destinationType.service_name}
                  className="group cursor-pointer rounded border border-neutral-100 transition-all duration-150 hover:border-emerald-500 hover:shadow-md"
                  onClick={() => onSelectDestinationType(destinationType)}
                >
                  <div className="flex items-center gap-3 p-3">
                    {logo ? (
                      <Image
                        src={logo}
                        alt={`${destinationType.label} logo`}
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-neutral-100">
                        <i className="fa-regular fa-plug text-neutral-500" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium group-hover:text-emerald-700">
                        {destinationType.label}
                      </span>
                      {destinationType.description && (
                        <span className="text-sm text-neutral-500">{destinationType.description}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
