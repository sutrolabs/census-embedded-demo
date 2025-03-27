import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState, useCallback } from "react"

import Button from "@components/Button/Button/Button"
import Card from "@components/Card/Card"
import Header from "@components/Structural/Header/Header"
import SyncManagement from "@components/SyncManagement"
import { useDestinations } from "@hooks/data/useDestinations"
import { useSegments } from "@hooks/data/useSegments"
import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"
import { createDevModeAttr } from "@utils/devMode"
import { embeddedDemoSourceLabel, usersInHighGrowthCitiesModelName } from "@utils/preset_source_destination"

export default function Index() {
  const router = useRouter()
  const { destinations, destinationTypes } = useDestinations()
  const { workspaceAccessToken, embedMode, devMode, loading, setLoading } = useCensusEmbedded()
  const { segments, fetchSegments } = useSegments()
  const [selectedSegment, setSelectedSegment] = useState(null)
  const [editSegmentWizardLink, setEditSegmentWizardLink] = useState(null)
  const [createSegmentWizardLink, setCreateSegmentWizardLink] = useState(null)

  const API_CREATE_EDIT_SEGMENT_LINK = "/api/create_edit_segment_management_link"
  const headers = {
    ["authorization"]: `Bearer ${workspaceAccessToken}`,
    ["content-type"]: "application/json",
  }

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

  const initiateCreateSegmentWizard = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/create_segment_management_link", {
        method: "POST",
        headers: headers,
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const data = await response.json()
      if (embedMode) {
        setCreateSegmentWizardLink(data.uri)
      } else {
        window.location.href = data.uri
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle segment selection
  const handleSegmentClick = (segment) => {
    router.push(`/audiences/${segment.id}`)
  }

  // Handle create segment button click
  const handleCreateSegmentClick = () => {
    router.push("/audiences/new")
  }

  return (
    <>
      <Head>
        <title>Audiences</title>
      </Head>
      <Header
        title="Audiences"
        action={
          <Button onClick={handleCreateSegmentClick}>
            <i className="fa-solid fa-plus" />
            Create New Audience
          </Button>
        }
      />
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="flex h-full flex-col overflow-y-auto p-3">
          {segments.length < 1 ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded bg-neutral-50 p-8">
              <span className="text-lg font-medium">No Segments Created, add a new segment</span>
              <Button onClick={handleCreateSegmentClick}>Add a new segment</Button>
            </div>
          ) : (
            <>
              {segments.map((segment) => (
                <div key={segment.id} className="group">
                  <button
                    className={`peer flex w-full flex-row justify-between rounded p-4 text-left text-lg transition-all duration-75 hover:bg-neutral-100`}
                    onClick={() => handleSegmentClick(segment)}
                    {...(devMode
                      ? createDevModeAttr({
                          url: `/api/sources/${segment.source_id}/filter_segments/${segment.id}`,
                          method: "GET",
                          headers: `Authorization: Bearer ${workspaceAccessToken}`,
                          body: `{ "sourceId": "sourceID", "segmentId": "segmentID" }`,
                          note: "Lists segments related to a particular source",
                          link: "google.com",
                        })
                      : {})}
                  >
                    <span>{segment.name}</span>
                    <div className="flex flex-row items-center gap-2">
                      <i className="fa-solid fa-table-rows" />
                      {segment.record_count}
                    </div>
                  </button>
                  <div className="h-px w-full bg-neutral-100 transition-all duration-75 peer-hover:opacity-0" />
                </div>
              ))}
            </>
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
