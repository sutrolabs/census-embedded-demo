import Head from "next/head"
import { useContext, useEffect } from "react"
import Button from "@components/Button"
import { Card } from "@components/Card"
import Destination from "@components/Destination"
import SyncManagement from "@components/SyncManagement"
import { IntegrationsContext } from "contexts/IntegrationsContext"
import { censusBaseUrl } from "@utils/url"
import { sourceLabel, sourceModelName } from "@utils/preset_source_destination"

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
  const { setSourceHidden, setSource, setDestinationHidden, setDestination } = useContext(IntegrationsContext)

  useEffect(() => {
    async function prefillAndHideSource(sourceId) {
      const apiResponse = await fetch(`${censusBaseUrl}/api/v1/sources/${sourceId}/models`, {
        method: "GET",
        headers: { ["authorization"]: `Bearer ${workspaceAccessToken}` },
      })
      const res = await apiResponse.json()

      const models = res.data
      const presetModel = models.find((m) => m.name == sourceModelName)
      setSource({ connection_id: sourceId, model_id: presetModel.id })
      setSourceHidden(true)
    }
    const presetSource = sources.find((s) => s.label == sourceLabel)
    prefillAndHideSource(presetSource?.id)
  }, [sources, destinations, setSource, setSourceHidden])

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
  facebookAudienceSyncs,
  googleAudienceSyncs,
  refetchSyncs,
  runsLoading,
  runs,
  workspaceAccessToken,
  devMode,
  embedMode,
}) {
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
