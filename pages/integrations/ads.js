import Head from "next/head"

import Button from "@components/Button"
import { Card } from "@components/Card"
import Destination from "@components/Destination"
import { SyncStatus } from "@components/SyncStatus"
import Toggle from "@components/Toggle"

export default function Index({
  personalAccessToken,
  workspaceId,
  destinations,
  setDestinations,
  destinationConnectLinks,
  setDestinationConnectLinks,
  syncs,
}) {
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
        personalAccessToken={personalAccessToken}
        workspaceId={workspaceId}
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
        personalAccessToken={personalAccessToken}
        workspaceId={workspaceId}
        destinations={destinations}
        setDestinations={setDestinations}
        destinationConnectLinks={destinationConnectLinks}
        setDestinationConnectLinks={setDestinationConnectLinks}
        syncs={syncs}
      />
      <p className="mt-2 text-teal-400">Step 2: Define your custom audience segments.</p>
      <Segment />
      <Button className="self-start" solid>
        <i className="fa-solid fa-plus mr-2" />
        New Segment
      </Button>
    </>
  )
}

function Segment() {
  return (
    <Card className="flex flex-col gap-4" disabled>
      <h3 className="flex flex-row justify-between text-lg font-medium">
        <span className="text-stone-500 data-[enabled]:text-teal-900" data-enabled={null}>
          High growth cities
        </span>
        <Toggle disabled />
      </h3>
      <p className="text-sm">All types of retailers in cities where tea growth YoY &gt; 10%</p>
      <p className="text-sm">82,991 contacts</p>
      <div className="flex flex-row items-center justify-between">
        <SyncStatus syncsLoading={false} syncs={[]} runsLoading={false} runs={[]} />
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
}
