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
  syncs,
  setSyncs,
}) {
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
      <DestinationWithObjects
        label="Salesforce"
        type="salesforce"
        iconClassName="fa-brands fa-salesforce"
        personalAccessToken={personalAccessToken}
        workspaceId={workspaceId}
        destinations={destinations}
        destinationConnectLinks={destinationConnectLinks}
        setDestinationConnectLinks={setDestinationConnectLinks}
        syncs={syncs}
        setSyncs={setSyncs}
        objects={[
          {
            label: "Account",
            fullName: "Account",
            sourceModelName: "retailers",
            mappings: ["Retailer type", "Annual tea revenue", "Local tea market YoY growth"],
          },
          {
            label: "Contact",
            fullName: "Contact",
            sourceModelName: "retailer_contacts",
            mappings: ["Job title", "Years of experience", "Personal tea preference"],
          },
        ]}
      />
      <DestinationWithObjects
        label="HubSpot"
        type="hubspot"
        iconClassName="fa-brands fa-hubspot"
        personalAccessToken={personalAccessToken}
        workspaceId={workspaceId}
        destinations={destinations}
        destinationConnectLinks={destinationConnectLinks}
        setDestinationConnectLinks={setDestinationConnectLinks}
        syncs={syncs}
        setSyncs={setSyncs}
        objects={[]}
      />
    </>
  )
}

function DestinationWithObjects({ objects, syncs, setSyncs, ...props }) {
  const { type, personalAccessToken, workspaceId, destinations } = props
  return (
    <Destination {...props}>
      <p className="text-teal-400">Step 2: Choose which the destinations objects to sync.</p>
      <div className="flex flex-col gap-5">
        {objects.map((object) => (
          <Object
            key={object.fullName}
            {...object}
            destinationType={type}
            personalAccessToken={personalAccessToken}
            workspaceId={workspaceId}
            destinations={destinations}
            syncs={syncs}
            setSyncs={setSyncs}
          />
        ))}
      </div>
    </Destination>
  )
}

function Object({
  label,
  fullName,
  sourceModelName,
  mappings,
  destinationType,
  personalAccessToken,
  workspaceId,
  destinations,
  syncs,
  setSyncs,
}) {
  const [loading, setLoading] = useState(false)
  const [disabledOverride, setDisabledOverride] = useState()
  const destination = destinations.find((item) => item.type === destinationType)
  const sync = syncs.find(
    (item) =>
      item.destination_attributes.connection_id === destination.id &&
      item.destination_attributes.object === fullName,
  )
  const disabled = disabledOverride ?? sync?.paused ?? true
  return (
    <Card className="flex flex-col gap-4" disabled={disabled}>
      <h4 className="flex flex-row justify-between">
        <span className="font-medium">{label}</span>
        <Toggle
          checked={!disabled}
          disabled={loading}
          onChange={async () => {
            try {
              setLoading(true)
              if (!sync) {
                setDisabledOverride(false)
                const response = await fetch("/api/create_crm_sync", {
                  method: "POST",
                  headers: {
                    ["authorization"]: `Bearer ${personalAccessToken}`,
                    ["content-type"]: "application/json",
                  },
                  body: JSON.stringify({
                    workspaceId,
                    destinationId: destination.id,
                    destinationObjectFullName: fullName,
                    sourceModelName,
                  }),
                })
                const data = await response.json()
                setSyncs([...syncs, data])
              } else {
                setDisabledOverride(!sync.paused)
                const response = await fetch("/api/set_sync_paused", {
                  method: "POST",
                  headers: {
                    ["authorization"]: `Bearer ${personalAccessToken}`,
                    ["content-type"]: "application/json",
                  },
                  body: JSON.stringify({
                    workspaceId,
                    id: sync.id,
                    paused: !sync.paused,
                  }),
                })
                const data = await response.json()
                setSyncs(syncs.map((item) => (item.id === sync.id ? data : item)))
              }
            } finally {
              setLoading(false)
              setDisabledOverride()
            }
          }}
        />
      </h4>
      <p className="-mb-2 text-sm">These attributes will get synced...</p>
      <ul className="ml-6 flex grow list-disc flex-col gap-1 text-sm">
        {mappings.map((mapping) => (
          <li key={mapping}>{mapping}</li>
        ))}
      </ul>
      {!disabled && (
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
      )}
    </Card>
  )
}
