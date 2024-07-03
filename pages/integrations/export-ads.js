import { IntegrationsContext } from "@contexts/IntegrationsContext"
import Head from "next/head"
import { useContext, useEffect, useState } from "react"

import Button from "@components/Button"
import { Card } from "@components/Card"
import Destination from "@components/Destination"
import SyncManagement from "@components/SyncManagement"
import { sourceLabel, sourceModelName } from "@utils/preset_source_destination"
import { censusBaseUrl } from "@utils/url"

export default function Index({
  sources,
  workspaceAccessToken,
  destinations,
  setDestinations,
  destinationConnectLinks,
  setDestinationConnectLinks,
  syncs,
  runsLoading,
  refetchSyncs,
  runs,
  embedMode,
  devMode,
}) {
  // const { setSourceHidden, setSource, setDestinationHidden, setDestination } = useContext(IntegrationsContext)

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

  return (
    <>
      <Head>
        <title>Ad Platforms - Integrations - Census Embedded Demo App</title>
      </Head>
      <h2 className="text-2xl font-bold text-stone-700">Integrations / Ad Platforms</h2>
      <hr className="border-t border-stone-400" />
      <p className="italic text-stone-500">
        Create custom ad audiences to match the retailer segments that matter to your business.
      </p>
      <p className="text-teal-400">Step 1: Choose your ad platforms.</p>
      <Destination
        label="Google Ads"
        type="google_ads"
        iconClassName="fa-brands fa-google"
        workspaceAccessToken={workspaceAccessToken}
        destinations={destinations}
        setDestinations={setDestinations}
        destinationConnectLinks={destinationConnectLinks}
        setDestinationConnectLinks={setDestinationConnectLinks}
        syncs={syncs}
      />
      <Destination
        label="Facebook Ads"
        type="facebook"
        iconClassName="fa-brands fa-facebook"
        workspaceAccessToken={workspaceAccessToken}
        destinations={destinations}
        setDestinations={setDestinations}
        destinationConnectLinks={destinationConnectLinks}
        setDestinationConnectLinks={setDestinationConnectLinks}
        syncs={syncs}
      />
      <p className="mt-2 text-teal-400">Step 2: Define your custom audience segments.</p>
      <Segment
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
      />
      <Button className="self-start" solid>
        <i className="fa-solid fa-plus mr-2" />
        New Segment
      </Button>
    </>
  )
}

function Segment({
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

  const prefillAndHideSource = async (sourceId) => {
    try {
      const apiResponse = await fetch(`${censusBaseUrl}/api/v1/sources/${sourceId}/models`, {
        method: "GET",
        headers: { authorization: `Bearer ${workspaceAccessToken}` },
      })
      const res = await apiResponse.json()
      const models = res.data
      console.log("models", models)
      setPresetModel(models.find((m) => m.name == sourceModelName))
    } catch (error) {
      console.error("Error fetching models:", error)
    }
  }

  useEffect(() => {
    if (sources.length > 0 && workspaceAccessToken) {
      const source = sources.find((s) => s.label === sourceLabel)
      console.log("source", source)
      if (source?.id) {
        prefillAndHideSource(source.id)
      }
      setPresetSource(source)
    }
  }, [sources, workspaceAccessToken])

  useEffect(() => {
    setGoogleAdsDestination(destinations.find((d) => d.type === "google_ads"))
    setFacebookAdsDestination(destinations.find((d) => d.type === "facebook"))
  }, [destinations])

  const presetSourceAndDestination = (destination) => {
    if (!presetSource?.id || !presetModel?.id || !destination?.id) return ""

    let queryParams = `&source_connection_id=${presetSource.id}&model_id=${presetModel.id}&source_hidden=true&destination_connection_id=${destination.id}`
    if (destination.name === "Facebook Ads") {
      queryParams += "&destination_object_name=customer&destination_hidden=true"
    } else if (destination.name === "Google Ads") {
      queryParams += "&destination_object_name=user_data&destination_hidden=true"
    }

    return queryParams
  }

  return (
    <Card className="flex flex-col gap-4" disabled>
      <h3 className="flex flex-row justify-between text-lg font-medium">
        <span className="text-stone-500 data-[enabled]:text-teal-900" data-enabled={null}>
          High growth cities
        </span>
      </h3>
      <p className="text-sm">All types of retailers in cities where product growth YoY &gt; 10%</p>
      <p className="text-sm">82,991 contacts</p>
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
          addNewSyncText={"Export segment to Google Ads"}
          useCase={"export"}
          // destination={googleAdsDestination}
          syncLinkQueryParams={presetSourceAndDestination(googleAdsDestination)}
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
          addNewSyncText={"Export segment to Facebook"}
          useCase={"export"}
          // destination={facebookAdsDestination}
          syncLinkQueryParams={presetSourceAndDestination(facebookAdsDestination)}
        />
      </Card>
    </Card>
  )
}

function DestinationLabel({ label }) {
  return (
    <h3 className="mb-2 flex flex-row justify-between">
      <span className="flex flex-row items-center gap-2 text-lg font-medium text-stone-500 data-[enabled]:text-teal-900">
        {label}
      </span>
    </h3>
  )
}
