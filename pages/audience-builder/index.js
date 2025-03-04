import { Text } from "@radix-ui/themes"
import Head from "next/head"
import { useEffect, useState, useCallback } from "react"

import Button from "@components/Button/Button/Button"
import Card from "@components/Card"
import EmbeddedFrame from "@components/EmbeddedFrame"
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
  const { workspaceAccessToken, embedMode, devMode, loading, setLoading } = useCensusEmbedded()
  const [selectedSegment, setSelectedSegment] = useState(null)
  const [editSegmentWizardLink, setEditSegmentWizardLink] = useState(null)
  const showEditSegmentWizard = !!editSegmentWizardLink

  const API_CREATE_EDIT_SEGMENT_LINK = "/api/create_edit_segment_management_link"
  const headers = {
    ["authorization"]: `Bearer ${workspaceAccessToken}`,
    ["content-type"]: "application/json",
  }

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

  const initiateEditSegmentWizard = async (segment) => {
    try {
      setLoading(true)
      const response = await fetch(API_CREATE_EDIT_SEGMENT_LINK, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          sourceId: segment.source_id,
          segmentId: segment.id,
        }),
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const data = await response.json()
      if (embedMode) {
        setEditSegmentWizardLink(data.uri)
      } else {
        window.location.href = data.uri
      }
    } finally {
      setLoading(false)
    }
  }
  // Handle segment selection
  const handleSegmentClick = (segment) => {
    setSelectedSegment(segment)
    initiateEditSegmentWizard(segment)
  }

  return (
    <>
      <Head>
        <title>Census Embedded Demo App</title>
      </Head>
      <Header title="Audience Builder"></Header>
      <div className="mx-auto flex h-full w-full flex-row overflow-hidden">
        {/* {!selectedSegment && (
          <div className="flex h-full w-1/3 min-w-[200px] max-w-[375px] flex-col overflow-hidden border-r border-neutral-100 bg-white">
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
            <div className="flex w-full border-t border-neutral-100 p-4">
              <Button className="w-full">New Audience</Button>
            </div>
          </div>
        )} */}
        <div className="flex h-full w-full flex-col bg-neutral-100 p-2">
          <div className="flex h-full w-full flex-col gap-6 overflow-hidden rounded border border-neutral-100 bg-white shadow">
            {selectedSegment ? (
              <div className="flex h-full w-full flex-col overflow-hidden">
                <Tabs defaultValue="segment" className="h-full w-full">
                  <TabsList>
                    <div className="w-[150px] shrink-0">
                      <button onClick={() => setSelectedSegment(null)}>{"<-"}</button>
                      {selectedSegment.name}
                    </div>
                    <div className=" mx-auto flex w-2/5 items-center justify-center">
                      <TabsTrigger value="segment">Audience</TabsTrigger>
                      <TabsTrigger value="sync">Sync</TabsTrigger>
                    </div>
                  </TabsList>
                  <TabsContent value="segment" className="h-full w-full">
                    {editSegmentWizardLink ? (
                      <EmbeddedFrame
                        className="h-full w-full"
                        connectLink={editSegmentWizardLink}
                        onExit={() => setEditSegmentWizardLink(null)}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Card className="p-6 text-center">
                          <Text size="5">Loading segment details...</Text>
                          {loading && (
                            <Text size="2" className="mt-2 text-neutral-500">
                              Please wait while we load the segment editor
                            </Text>
                          )}
                          {!loading && (
                            <Text size="2" className="mt-2 text-neutral-500">
                              Click the Configure button to edit this segment
                            </Text>
                          )}
                        </Card>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="sync">
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
                <div className="flex w-full flex-row justify-end border-t border-neutral-100 bg-white p-3">
                  <Button className="text-sm">
                    <i className="fa-solid fa-trash mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col overflow-hidden ">
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
                <div className="flex w-full border-t border-neutral-100 p-4">
                  <Button className="w-full">New Audience</Button>
                </div>
              </div>
            )}
          </div>
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
