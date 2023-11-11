import Head from "next/head"
import { useState } from "react"
import { useFetch } from "usehooks-ts"

import Button from "@components/Button"
import { Card } from "@components/Card"
import Destination from "@components/Destination"
import Error_ from "@components/Error_"
import Loading from "@components/Loading"
import { Tag } from "@components/Tag"
import Toggle from "@components/Toggle"

export default function Index({ personalAccessToken, workspaceId }) {
  const { error: destinationsError, data: destinations } = useFetch("/api/list_destinations", {
    method: "GET",
    headers: {
      ["authorization"]: `Bearer ${personalAccessToken}`,
      ["census-workspace-id"]: `${workspaceId}`,
    },
  })
  const { error: destinationConnectLinksError, data: destinationConnectLinks } = useFetch(
    "/api/list_destination_connect_links",
    {
      method: "GET",
      headers: {
        ["authorization"]: `Bearer ${personalAccessToken}`,
        ["census-workspace-id"]: `${workspaceId}`,
      },
    },
  )

  if (destinationsError || destinationConnectLinksError) {
    return <Error_ error={destinationsError ?? destinationConnectLinksError} />
  } else if (!destinations || !destinationConnectLinks) {
    return <Loading />
  }

  return (
    <>
      <Head>
        <title>CRM - Integrations - Census Embedded Demo App</title>
      </Head>
      <h2 className="text-2xl font-bold text-stone-700">Integrations / CRM</h2>
      <hr className="border-t border-stone-400" />
      <p className="italic text-stone-500">
        Get access to relevant tea retailer and trend data right within your everyday sales tools.
      </p>
      <p className="text-teal-400">Step 1: Choose which CRM system you&apos;d like to keep in sync.</p>
      <DestinationWithSyncs
        name="Salesforce"
        type="salesforce"
        iconClassName="fa-brands fa-salesforce"
        personalAccessToken={personalAccessToken}
        workspaceId={workspaceId}
        destinations={destinations}
        destinationConnectLinks={destinationConnectLinks}
      />
      <DestinationWithSyncs
        name="HubSpot"
        type="hubspot"
        iconClassName="fa-brands fa-hubspot"
        personalAccessToken={personalAccessToken}
        workspaceId={workspaceId}
        destinations={destinations}
        destinationConnectLinks={destinationConnectLinks}
      />
    </>
  )
}

function DestinationWithSyncs({ ...props }) {
  return (
    <Destination {...props}>
      <p className="text-teal-400">Step 2: Choose which the destinations objects to sync.</p>
      <div className="flex flex-col gap-5">
        <Sync name="Accounts">
          <p className="-mb-2 text-sm">These attributes will get synced...</p>
          <ul className="ml-6 flex grow list-disc flex-col gap-1 text-sm">
            <li>Retailer type</li>
            <li>Annual tea revenue</li>
            <li>Local tea market YoY growth</li>
          </ul>
        </Sync>
        <Sync name="Contacts">
          <p className="-mb-2 text-sm">These attributes will get synced...</p>
          <ul className="ml-6 flex grow list-disc flex-col gap-1 text-sm">
            <li>Job title</li>
            <li>Years of experience</li>
            <li>Personal tea preference</li>
          </ul>
        </Sync>
      </div>
    </Destination>
  )
}

function Sync({ name, children }) {
  const [sync, setSync] = useState()
  return (
    <Card className="flex flex-col gap-4" disabled={!sync}>
      <h4 className="flex flex-row justify-between">
        <span className="font-medium">{name}</span>
        <Toggle
          checked={!!sync}
          onChange={(checked) => {
            setSync(checked ? {} : undefined)
          }}
        />
      </h4>
      {children}
      {sync ? (
        <div className="flex flex-row items-center justify-between">
          <Tag
            className="bg-emerald-200 text-xs font-medium text-emerald-700"
            text="Up to date (1 hour ago)"
          />
          <Button className="text-sm">
            <i className="fa-solid fa-gear mr-2" />
            Configure
          </Button>
        </div>
      ) : null}
    </Card>
  )
}
