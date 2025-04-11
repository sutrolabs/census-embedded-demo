import { Text } from "@radix-ui/themes"
import { format } from "date-fns"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState, useEffect, useCallback } from "react"

import Button from "@components/Button/Button/Button"
import { NewDestinationSelectionMenu } from "@components/Command/NewDesitnationSelectionMenu/NewDestinationSelectionMenu"
import { SyncManagementDrawer } from "@components/Drawer/SyncManagementDrawer/SyncManagementDrawer"
import Header from "@components/Structural/Header/Header"
import SegmentTabs from "@components/Tabs/SegmentTabs"
import { useDestinations } from "@hooks/data/useDestinations"
import { useSegments } from "@hooks/data/useSegments"
import { EXCLUDED_DESTINATION_CONNECTIONS } from "@hooks/helpers/useExclusions"
import { getLogoForDestination, getLogoForDestinationType } from "@hooks/useDestinationLogos"
import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"
import { createDevModeAttr } from "@utils/devMode"

export default function SegmentSyncs() {
  const router = useRouter()
  const { id } = router.query
  const { destinations, destinationTypes } = useDestinations()
  const { segments } = useSegments()
  const { workspaceAccessToken, devMode } = useCensusEmbedded()
  const segment = segments?.find((s) => String(s.id) === String(id))
  const [isSyncDrawerOpen, setIsSyncDrawerOpen] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [selectedSync, setSelectedSync] = useState(null)
  const [segmentSource, setSegmentSource] = useState(null)
  const [syncs, setSyncs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSource = async () => {
      if (!segment?.dataset_id || !workspaceAccessToken) return

      try {
        const response = await fetch(`/api/list_sources`, {
          headers: {
            ["authorization"]: `Bearer ${workspaceAccessToken}`,
            ["content-type"]: "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch sources")
        }

        const sources = await response.json()
        const source = sources.find((s) => s.id === segment.dataset_id)
        setSegmentSource(source)
      } catch (error) {
        setSegmentSource(null)
      }
    }

    fetchSource()
  }, [segment, workspaceAccessToken])

  // Filter out any destination types that shouldn't be shown
  // Similar to source types, we might want to exclude certain destinations
  const filteredDestinationTypes = destinationTypes.filter(
    (destinationType) =>
      !EXCLUDED_DESTINATION_CONNECTIONS.includes(destinationType.service_name) &&
      destinationType.creatable_via_connect_link === true &&
      getLogoForDestinationType(destinationType) !== null,
  )

  const filteredDestinations = destinations.filter((destination) =>
    filteredDestinationTypes.some((type) => type.service_name === destination.type),
  )

  const fetchSyncs = useCallback(async () => {
    if (!id || !workspaceAccessToken) return

    try {
      const response = await fetch(`/api/list_syncs`, {
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch syncs")
      }

      const data = await response.json()
      setSyncs(data)
    } catch (error) {
      setSyncs([])
    }
  }, [id, workspaceAccessToken])

  useEffect(() => {
    fetchSyncs()
  }, [fetchSyncs])

  const runSync = useCallback(
    async (sync) => {
      try {
        setLoading(true)
        const response = await fetch("/api/trigger_sync_run", {
          method: "POST",
          headers: {
            ["authorization"]: `Bearer ${workspaceAccessToken}`,
            ["content-type"]: "application/json",
          },
          body: JSON.stringify({
            syncId: sync.id,
          }),
        })
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        setSyncs((syncs) =>
          syncs.map((item) =>
            item.id === sync.id ? { ...sync, updated_at: new Date().toISOString() } : item,
          ),
        )
        await fetchSyncs()
      } finally {
        setLoading(false)
      }
    },
    [workspaceAccessToken, fetchSyncs],
  )

  const getSyncsForSegment = syncs.filter(
    (sync) => sync.source_attributes?.object.filter_segment_id === segment?.id,
  )

  const filterSyncsToDestination = (destinationId) => {
    return getSyncsForSegment.filter((sync) => sync.destination_attributes?.connection_id === destinationId)
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <Header
        title="Audiences"
        nestedPage={segment?.name}
        backButtonClick={() => router.push("/audiences")}
      />
      <SegmentTabs segmentId={id} currentTab="destinations" />
      <div className="flex h-full w-full flex-col overflow-y-auto px-6">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col">
          {filteredDestinations ? (
            <div className="flex flex-col gap-7 pt-8">
              {filteredDestinations.map((destination) => {
                const logo = getLogoForDestination(destination)

                return (
                  <div
                    key={destination.id}
                    className="flex flex-col items-start overflow-hidden rounded-lg  bg-zinc-50"
                    {...(devMode
                      ? createDevModeAttr({
                          url: `https://app.getcensus.com/api/v1/destinations`,
                          method: "GET",
                          headers: `Authorization: Bearer <workspaceAccessToken>`,
                          note: "Lists destinations from a workspace",
                          link: "https://developers.getcensus.com/api-reference/destinations/list-destinations",
                        })
                      : {})}
                  >
                    <div className="flex w-full flex-row items-center justify-between gap-4 px-6 py-3">
                      <div className="flex flex-row items-center gap-4">
                        <Image
                          src={logo}
                          alt={`${destination.label} logo`}
                          width={24}
                          height={24}
                          className="h-6 w-6 object-contain"
                        />
                        <Text className="text-lg font-medium">{destination.name}</Text>
                      </div>
                      <Button
                        {...(devMode
                          ? createDevModeAttr({
                              url: `https://app.getcensus.com/api/v1/sync_management_links`,
                              method: "POST",
                              headers: `{
"authorization": "Bearer: <workspaceAccessToken>",
"content-type": "application/json"
}`,
                              note: "Create a sync management link",
                              link: "https://developers.getcensus.com/api-reference/syncs/update-a-sync",
                            })
                          : {})}
                        onClick={() => {
                          setSelectedSync(null)
                          setSelectedDestination(destination)
                          setIsSyncDrawerOpen(true)
                        }}
                      >
                        New Sync to {destination.name}
                      </Button>
                    </div>
                    {filterSyncsToDestination(destination.id).length > 0 ? (
                      <div className="flex w-full flex-col rounded-lg border border-zinc-100 bg-white">
                        {filterSyncsToDestination(destination.id).map((sync) => (
                          <div
                            key={sync.id}
                            className="flex w-full flex-row items-center justify-between border-b border-zinc-100 px-6 py-4"
                            {...(devMode
                              ? createDevModeAttr({
                                  url: `https://app.getcensus.com/api/v1/syncs`,
                                  method: "GET",
                                  headers: `Authorization: Bearer <workspaceAccessToken>`,
                                  note: "Lists syncs from a workspace",
                                  link: "https://developers.getcensus.com/api-reference/syncs/list-syncs",
                                })
                              : {})}
                          >
                            <div className="flex flex-row items-center gap-5">
                              <Image
                                src={logo}
                                alt={`${destination.label} logo`}
                                width={24}
                                height={24}
                                className="h-6 w-6 object-contain"
                              />
                              <Text className="font-medium capitalize">
                                {destination.name} {sync.destination_attributes.object}
                              </Text>
                              {sync.destination_attributes.label && (
                                <Text>{sync.destination_attributes.label}</Text>
                              )}
                              <Text className=" text-neutral-500">
                                Last Run {format(new Date(sync.updated_at), "MMM dd yyyy")}{" "}
                                <span>{format(new Date(sync.updated_at), "p")}</span>
                              </Text>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() => runSync(sync)}
                                disabled={loading}
                                {...(devMode
                                  ? createDevModeAttr({
                                      url: `https://app.getcensus.com/api/v1/syncs/${sync.id}`,
                                      method: "PATCH",
                                      headers: `{
                  "authorization": "Bearer: <workspaceAccessToken>",
                  "content-type": "application/json"
                }`,
                                      body: `{
                  "paused": "${sync.paused ? "true" : "false"}"
                }`,
                                      note: "Update a sync's status",
                                      link: "https://developers.getcensus.com/api-reference/syncs/update-a-sync",
                                    })
                                  : {})}
                              >
                                <i className="fa-solid fa-play" />
                                {loading ? "Running..." : "Run Now"}
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedSync(sync)
                                  setSelectedDestination(destination)
                                  setIsSyncDrawerOpen(true)
                                }}
                              >
                                <i className="fa-solid fa-edit" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex w-full flex-col items-center justify-center rounded-lg border border-zinc-100 bg-white px-6 py-8">
                        No syncs to {destination.name}.
                      </div>
                    )}
                  </div>
                )
              })}
              <NewDestinationSelectionMenu
                workspaceAccessToken={workspaceAccessToken}
                destinationTypes={destinationTypes}
                trigger="New Destination"
              />
            </div>
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
          onClose={() => {
            setIsSyncDrawerOpen(false)
            setSelectedDestination(null)
            setSelectedSync(null)
          }}
          workspaceAccessToken={workspaceAccessToken}
          presetSource={segment ? { segment_id: segment.id, name: segment.name } : undefined}
          presetDestination={selectedDestination}
          presetSync={selectedSync}
          onSyncComplete={fetchSyncs}
        />
      </div>
    </div>
  )
}
