import Head from "next/head"
import { useState } from "react"
import { useFetch } from "usehooks-ts"

import Button from "@components/Button"
import { Card } from "@components/Card"
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
      <p className="text-teal-400">Step 1: Choose which destinations you&apos;d like to keep in sync.</p>
      <Destination
        name="Salesforce"
        type="salesforce"
        personalAccessToken={personalAccessToken}
        workspaceId={workspaceId}
        destinations={destinations}
        destinationConnectLinks={destinationConnectLinks}
      />
      <Destination
        name="HubSpot"
        type="hubspot"
        personalAccessToken={personalAccessToken}
        workspaceId={workspaceId}
        destinations={destinations}
        destinationConnectLinks={destinationConnectLinks}
      />
    </>
  )
}

function Destination({
  name,
  type,
  personalAccessToken,
  workspaceId,
  destinations,
  destinationConnectLinks,
}) {
  const [now] = useState(() => new Date())
  const [revoked, setRevoked] = useState(false)

  const destination = destinations.find((destination) => destination.type === type)
  const destinationConnectLink = revoked
    ? undefined
    : destinationConnectLinks.find(
        (destinationConnectLink) =>
          destinationConnectLink.type === type &&
          new Date(destinationConnectLink.expiration) > now &&
          !destinationConnectLink.revoked,
      )

  return (
    <Card className="flex flex-col gap-4" disabled={!destination}>
      <h3
        className="flex flex-row justify-between text-lg font-medium text-stone-600 data-[enabled]:text-teal-900"
        data-enabled={destination ? "" : null}
      >
        <span className="flex flex-row items-center gap-2">
          <i className={`fa-brands fa-${type}`} />
          {name}
        </span>
        {!destination && destinationConnectLink ? (
          <span className="flex flex-row gap-2 text-sm">
            <Button
              solid
              onClick={() => {
                window.location.href = destinationConnectLink.uri
              }}
            >
              Continue connecting
            </Button>
            <Button
              onClick={async () => {
                await fetch("/api/revoke_destination_connect_link", {
                  method: "POST",
                  headers: {
                    ["authorization"]: `Bearer ${personalAccessToken}`,
                    ["census-workspace-id"]: `${workspaceId}`,
                    ["content-type"]: "application/json",
                  },
                  body: JSON.stringify({
                    id: destinationConnectLink.id,
                  }),
                })
                setRevoked(true)
              }}
            >
              Cancel
            </Button>
          </span>
        ) : (
          <Toggle
            checked={!!destination}
            onChange={async (checked) => {
              if (!checked) {
                return
              }
              const response = await fetch("/api/create_destination_connect_link", {
                method: "POST",
                headers: {
                  ["authorization"]: `Bearer ${personalAccessToken}`,
                  ["census-workspace-id"]: `${workspaceId}`,
                  ["content-type"]: "application/json",
                },
                body: JSON.stringify({
                  type,
                }),
              })
              const data = await response.json()
              window.location.href = data.uri
            }}
          />
        )}
      </h3>
      {destination ? (
        <>
          <p className="text-teal-400">Step 2: Choose which the destinations objects to sync.</p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
        </>
      ) : null}
    </Card>
  )
}

function Sync({ name, children }) {
  const [sync, setSync] = useState()
  return (
    <Card className="flex flex-col gap-4" disabled={!sync}>
      <h4 className="flex flex-row justify-between font-medium">
        {name}
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
          <Button className="text-sm">Configure</Button>
        </div>
      ) : null}
    </Card>
  )
}
