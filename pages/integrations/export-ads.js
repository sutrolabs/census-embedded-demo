import Head from "next/head"

import Button from "@components/Button"
import { Card } from "@components/Card"
import Destination from "@components/Destination"

export default function Index({
  workspaceAccessToken,
  destinations,
  setDestinations,
  destinationConnectLinks,
  setDestinationConnectLinks,
  syncs,
}) {
  const destinationForSync = (sync) => {
    return destinations.find(d => d.id === sync.destination_attributes.connection_id)
  }

  const isFacebooksAudienceSync = (sync) => {
    return destinationForSync(sync).type === "facebook" && sync.destination_attributes.object === "customer"
  }

  const isGoogleAudienceSync = (sync) => {
    return destinationForSync(sync).type === "google_ads" && sync.destination_attributes.object === "user_data"
  }

  const syncsToAdsDestinations = syncs.filter(sync => isFacebooksAudienceSync(sync) || isGoogleAudienceSync(sync))

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
      <Segment syncsToAdsDestinations={syncsToAdsDestinations} destinationForSync={destinationForSync} />
      <Button className="self-start" solid>
        <i className="fa-solid fa-plus mr-2" />
        New Segment
      </Button>
    </>
  )
}

function Segment({syncsToAdsDestinations, destinationForSync}) {
  return (
    <Card className="flex flex-col gap-4" disabled>
      <h3 className="flex flex-row justify-between text-lg font-medium">
        <span className="text-stone-500 data-[enabled]:text-teal-900" data-enabled={null}>
          High growth cities
        </span>
      </h3>
      <p className="text-sm">All types of retailers in cities where product growth YoY &gt; 10%</p>
      <p className="text-sm">82,991 contacts</p>
      {
        syncsToAdsDestinations.map((sync, index) => {
          return (
            <Card key={index}>
              <div className="flex flex-row items-center justify-between">
                <DestinationLabel label={destinationForSync(sync).name} />
                <div className="flex flex-row gap-3">
                  <Button className="text-sm" disabled>
                    <i className="fa-solid fa-play mr-2" />
                    Run now
                  </Button>
                  <Button className="text-sm" disabled>
                    <i className="fa-solid fa-gear mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            </Card>
          )
        })
      }
      <Button
        className="flex items-center justify-center rounded-md border border-indigo-500/40 bg-stone-50  px-5 py-8 text-xl shadow-sm"
          // onClick={initiateSyncWizardFlow}
        >
        <i className="fa-solid fa-plus mr-4" />
        Export Segment to Ads Platform
      </Button>
    </Card>
  )
}

function DestinationLabel({label}) {
  return (
    <h3 className="flex flex-row justify-between">
      <span
        className="flex flex-row items-center gap-2 text-lg font-medium text-stone-500 data-[enabled]:text-teal-900"
      >
        {label}
      </span>
    </h3>
  )
}
