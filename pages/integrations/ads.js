import Head from "next/head"
import { useState } from "react"

import Button from "@components/Button"
import { Card } from "@components/Card"
import Destination from "@components/Destination"
import { Tag } from "@components/Tag"
import Toggle from "@components/Toggle"

export default function Index({
  personalAccessToken,
  workspaceId,
  destinations,
  destinationConnectLinks,
  setDestinationConnectLinks,
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
        name="Google Ads"
        type="google_ads"
        iconClassName="fa-brands fa-google"
        personalAccessToken={personalAccessToken}
        workspaceId={workspaceId}
        destinations={destinations}
        destinationConnectLinks={destinationConnectLinks}
        setDestinationConnectLinks={setDestinationConnectLinks}
      />
      <Destination
        name="Facebook Ads"
        type="facebook"
        iconClassName="fa-brands fa-facebook"
        personalAccessToken={personalAccessToken}
        workspaceId={workspaceId}
        destinations={destinations}
        destinationConnectLinks={destinationConnectLinks}
        setDestinationConnectLinks={setDestinationConnectLinks}
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
  const [enabled, setEnabled] = useState(true)

  return (
    <Card className="flex flex-col gap-4" disabled={!enabled}>
      <h3 className="flex flex-row justify-between text-lg font-medium">
        <span className="text-stone-500 data-[enabled]:text-teal-900" data-enabled={enabled ? "" : null}>
          High growth cities
        </span>
        <Toggle checked={enabled} onChange={setEnabled} />
      </h3>
      <p className="text-sm">All types of retailers in cities where tea growth YoY &gt; 10%</p>
      <p className="text-sm">82,991 contacts</p>
      {enabled ? (
        <>
          <div className="flex flex-row items-center justify-between">
            <Tag
              className="bg-emerald-200 text-xs font-medium text-emerald-700"
              text="Up to date (1 hour ago)"
            />
            <Button solid>
              <i className="fa-solid fa-gear mr-2" />
              Configure
            </Button>
          </div>
        </>
      ) : null}
    </Card>
  )
}
