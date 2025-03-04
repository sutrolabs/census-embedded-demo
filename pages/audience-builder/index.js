import { Text } from "@radix-ui/themes"
import Head from "next/head"
import { useEffect, useState, useCallback } from "react"

import Card from "@components/Card"
import { SegmentObject } from "@components/SegmentObject"
import Header from "@components/Structural/Header/Header"
import SyncManagement from "@components/SyncManagement"
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@components/Tabs/Tabs"
import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"
import { embeddedDemoSourceLabel, usersInHighGrowthCitiesModelName } from "@utils/preset_source_destination"

export default function Index({
  sources,
  destinations,
  setDestinations,
  destinationConnectLinks,
  setDestinationConnectLinks,
  syncs,
  runsLoading,
  refetchSyncs,
  segments,
  refetchSegments,
  setSegments,
  runs,
}) {
  const { workspaceAccessToken, embedMode, devMode } = useCensusEmbedded()
  const [selectedSegment, setSelectedSegment] = useState(null)

  const destinationForSync = (sync) => {
    return destinations.find((d) => d.id === sync.destination_attributes.connection_id)
  }

  const isFacebooksAudienceSync = (sync) => {
    return destinationForSync(sync).type === "facebook" && sync.destination_attributes.object === "customer"
  }

  const isGoogleAudienceSync = (sync) => {
    return (
      destinationForSync(sync).type === "google_ads" && sync.destination_attributes.object === "user_data"
    )
  }

  const googleAudienceSyncs = syncs.filter(isGoogleAudienceSync)
  const facebookAudienceSyncs = syncs.filter(isFacebooksAudienceSync)

  // Handle segment selection
  const handleSegmentClick = (segment) => {
    setSelectedSegment(segment)
  }

  return (
    <>
      <Head>
        <title>Census Embedded Demo App</title>
      </Head>
      <Header title="Audience Builder" />
      <div className="mx-auto flex h-full w-full flex-row overflow-hidden">
        <div className="flex h-full w-1/3 max-w-[375px] flex-col overflow-hidden border-r border-neutral-100">
          <div className="border-b border-neutral-100 p-3">
            <Text>Your Audiences</Text>
          </div>
          <div className="flex h-full flex-col overflow-y-auto p-3">
            {segments
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
              .map((segment) => (
                <button
                  key={segment.id}
                  className={`flex w-full flex-row rounded p-2 text-left hover:bg-neutral-100 ${
                    selectedSegment?.id === segment.id ? "bg-neutral-100" : ""
                  }`}
                  onClick={() => handleSegmentClick(segment)}
                >
                  {segment.name}
                </button>
              ))}
          </div>
        </div>
        <div className="flex flex-col">
          {selectedSegment ? (
            <div className="flex w-full flex-col gap-6">
              <Tabs defaultValue="segment">
                <TabsList>
                  <TabsTrigger value="segment">Segment</TabsTrigger>
                  <TabsTrigger value="sync">Sync</TabsTrigger>
                </TabsList>
                <TabsContent value="segment">
                  <SegmentObject
                    segment={selectedSegment}
                    refetchSegments={refetchSegments}
                    workspaceAccessToken={workspaceAccessToken}
                    setSegments={setSegments}
                    devMode={devMode}
                    embedMode={embedMode}
                  />
                </TabsContent>
                <TabsContent value="sync">
                  {" "}
                  <Sync
                    destinations={destinations}
                    sources={sources}
                    facebookAudienceSyncs={facebookAudienceSyncs}
                    googleAudienceSyncs={googleAudienceSyncs}
                    runsLoading={runsLoading}
                    refetchSyncs={refetchSyncs}
                    runs={runs}
                    workspaceAccessToken={workspaceAccessToken}
                    devMode={devMode}
                    embedMode={embedMode}
                    selectedSegment={selectedSegment}
                  />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <Card className="p-6 text-center">
                <Text size="5">Select an audience to view details</Text>
                <Text size="2" className="mt-2 text-neutral-500">
                  Click on an audience from the list on the left to view its details and sync options
                </Text>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function Sync({
  sources,
  destinations,
  facebookAudienceSyncs,
  googleAudienceSyncs,
  refetchSyncs,
  runsLoading,
  runs,
  workspaceAccessToken,
  devMode,
  embedMode,
}) {
  const [presetModel, setPresetModel] = useState(null)
  const [presetSource, setPresetSource] = useState(null)
  const [googleAdsDestination, setGoogleAdsDestination] = useState(null)
  const [facebookAdsDestination, setFacebookAdsDestination] = useState(null)

  const prefillAndHideSource = useCallback(
    async (sourceId) => {
      try {
        const apiResponse = await fetch(`/api/list_models_for_source?sourceId=${sourceId}`, {
          method: "GET",
          headers: {
            ["authorization"]: `Bearer ${workspaceAccessToken}`,
          },
        })
        const models = await apiResponse.json()
        setPresetModel(models.find((m) => m.name === usersInHighGrowthCitiesModelName))
      } catch (error) {
        // do nothing, we will display the source selector if models couldn't be fetched
      }
    },
    [workspaceAccessToken],
  )

  useEffect(() => {
    const source = sources.find((s) => s.label === embeddedDemoSourceLabel)
    if (source?.id) {
      prefillAndHideSource(source.id)
    }
    setPresetSource(source)
  }, [sources, workspaceAccessToken, prefillAndHideSource])

  useEffect(() => {
    setGoogleAdsDestination(destinations.find((d) => d.type === "google_ads"))
    setFacebookAdsDestination(destinations.find((d) => d.type === "facebook"))
  }, [destinations])

  const presetSourceAndDestination = (destination, edit = false) => {
    if (!presetSource?.id || !presetModel?.id || !destination?.id) return ""

    let queryParams = `&source_hidden=true&destination_hidden=true`

    if (!edit) {
      queryParams += `&source_connection_id=${presetSource.id}&model_id=${presetModel.id}&destination_connection_id=${destination.id}`

      if (destination.type === "facebook") {
        queryParams += "&destination_object_name=customer"
      } else if (destination.type === "google_ads") {
        queryParams += "&destination_object_name=user_data"
      }
    }

    return queryParams
  }

  return (
    <Card className="flex flex-col gap-4" disabled>
      <Card>
        <DestinationLabel label={"Google Ads"} />
        <SyncManagement
          sourceId={null}
          refetchSyncs={refetchSyncs}
          syncManagementLinks={[]}
          refetchSyncManagementLinks={() => {}}
          workspaceAccessToken={workspaceAccessToken}
          syncs={googleAudienceSyncs}
          setSyncs={() => {}}
          runsLoading={runsLoading}
          runs={runs}
          devMode={devMode}
          embedMode={embedMode}
          addNewSyncText={"Sync segment to Google Ads"}
          useCase={"export"}
          createSyncLinkQueryParams={presetSourceAndDestination(googleAdsDestination)}
          editSyncLinkQueryParams={presetSourceAndDestination(googleAdsDestination, true)}
        />
      </Card>
      <Card>
        <DestinationLabel label={"Facebook"} />
        <SyncManagement
          sourceId={null}
          refetchSyncs={refetchSyncs}
          syncManagementLinks={[]}
          refetchSyncManagementLinks={() => {}}
          workspaceAccessToken={workspaceAccessToken}
          syncs={facebookAudienceSyncs}
          setSyncs={() => {}}
          runsLoading={runsLoading}
          runs={runs}
          devMode={devMode}
          embedMode={embedMode}
          addNewSyncText={"Sync segment to Facebook"}
          useCase={"export"}
          createSyncLinkQueryParams={presetSourceAndDestination(facebookAdsDestination)}
          editSyncLinkQueryParams={presetSourceAndDestination(facebookAdsDestination, true)}
        />
      </Card>
    </Card>
  )
}

function DestinationLabel({ label }) {
  return (
    <h3 className="mb-2 flex flex-row justify-between">
      <span className="flex flex-row items-center gap-2 text-lg font-medium text-neutral-500 data-[enabled]:text-emerald-900">
        {label}
      </span>
    </h3>
  )
}
