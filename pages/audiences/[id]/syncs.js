import { Text } from "@radix-ui/themes"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"

import Button from "@components/Button/Button/Button"
import { NewDestinationSelectionMenu } from "@components/Command/NewDesitnationSelectionMenu/NewDestinationSelectionMenu"
import { SyncManagementDrawer } from "@components/Drawer/SyncManagementDrawer/SyncManagementDrawer"
import Header from "@components/Structural/Header/Header"
import SegmentTabs from "@components/Tabs/SegmentTabs"
import { useDestinations } from "@hooks/data/useDestinations"
import { useSegments } from "@hooks/data/useSegments"
import { getLogoForDestination, getLogoForDestinationType } from "@hooks/useDestinationLogos"
import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"

export default function SegmentSyncs() {
  const router = useRouter()
  const { id } = router.query
  const { destinations, destinationTypes } = useDestinations()
  const { segments } = useSegments()
  const { workspaceAccessToken } = useCensusEmbedded()
  const segment = segments?.find((s) => String(s.id) === String(id))

  const [isSyncDrawerOpen, setIsSyncDrawerOpen] = useState(false)

  // Filter out any destination types that shouldn't be shown
  // Similar to source types, we might want to exclude certain destinations
  const excludedDestinations = ["internal", "test"]
  const filteredDestinationTypes = destinationTypes.filter(
    (destinationType) =>
      !excludedDestinations.includes(destinationType.service_name) &&
      destinationType.creatable_via_connect_link === true &&
      getLogoForDestinationType(destinationType) !== null,
  )

  const filteredDestinations = destinations.filter((destination) =>
    filteredDestinationTypes.some((type) => type.service_name === destination.type),
  )

  //   const [syncs, setSyncs] = useState([])

  //   useEffect(() => {
  //     const fetchSyncs = async () => {
  //       if (!id || !workspaceAccessToken) return

  //       try {
  //         const response = await fetch(`/api/segments/${id}/syncs`, {
  //           headers: {
  //             ["authorization"]: `Bearer ${workspaceAccessToken}`,
  //             ["content-type"]: "application/json",
  //           },
  //         })

  //         if (!response.ok) {
  //           throw new Error("Failed to fetch syncs")
  //         }

  //         const data = await response.json()
  //         setSyncs(data)
  //       } catch (error) {
  //         setSyncs([])
  //       }
  //     }

  //     fetchSyncs()
  //   }, [id, workspaceAccessToken])

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <Header
        title="Audiences"
        nestedPage={segment?.name}
        backButtonClick={() => router.push("/audiences")}
      />

      <div className="flex h-full w-full flex-col overflow-hidden">
        <SegmentTabs segmentId={id} currentTab="sync" />

        <div className="flex flex-row items-center justify-between border-b border-neutral-100 px-6 py-4">
          <Text>Sync {segment?.name}</Text>
          <div>
            <Button onClick={() => setIsSyncDrawerOpen(true)}>New Sync</Button>

            <NewDestinationSelectionMenu
              workspaceAccessToken={workspaceAccessToken}
              destinationTypes={destinationTypes}
              trigger="New Destination"
            />
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-[1200px] flex-col px-6">
          {filteredDestinations.length > 0 ? (
            <>
              {filteredDestinations.map((destination) => {
                const logo = getLogoForDestination(destination)

                return (
                  <div key={destination.id} className="flex flex-col border-b border-neutral-100 px-8 py-6">
                    <div className="flex flex-row items-center gap-4">
                      <Image
                        src={logo}
                        alt={`${destination.label} logo`}
                        width={24}
                        height={24}
                        className="h-6 w-6 object-contain"
                      />
                      <Text className="text-lg">{destination.name}</Text>
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
              <Text size="5">No destinations connected</Text>
              <Text size="2" className="text-neutral-500">
                Connect a destination to sync this audience
              </Text>
              <NewDestinationSelectionMenu
                workspaceAccessToken={workspaceAccessToken}
                destinationTypes={destinationTypes}
                destinations={destinations}
                trigger="New Destination"
              />
            </div>
          )}
        </div>

        <SyncManagementDrawer
          isOpen={isSyncDrawerOpen}
          onClose={() => setIsSyncDrawerOpen(false)}
          workspaceAccessToken={workspaceAccessToken}
          presetSource={segment ? { id: segment.id, name: segment.name } : undefined}
        />
      </div>
    </div>
  )
}
