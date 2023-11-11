import { useState } from "react"

import Button from "@components/Button"
import { Card } from "@components/Card"

export default function Integration({
  name,
  description,
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

  const buttons = destination ? (
    <>
      <Button solid onClick={() => {}}>
        Configure
      </Button>
    </>
  ) : destinationConnectLink ? (
    <>
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
    </>
  ) : (
    <>
      <Button
        solid
        onClick={async () => {
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
      >
        Connect now
      </Button>
    </>
  )
  return (
    <Card className="flex flex-col gap-2" disabled={!destination}>
      <div className="flex flex-row items-center justify-between">
        <span
          className="font-medium text-stone-400 data-[destination]:text-teal-800"
          data-destination={destination ? "" : null}
        >
          {name}
        </span>
        <span
          className="rounded-lg bg-stone-200 px-2 py-1 text-xs text-stone-400 data-[destination]:bg-green-200 data-[destination]:text-green-600"
          data-destination={destination ? "" : null}
        >
          {destination ? "connected" : "not connected"}
        </span>
      </div>
      <div
        className="mb-auto text-stone-300 data-[destination]:text-teal-800"
        data-destination={destination ? "" : null}
      >
        {description}
      </div>
      <div className="mt-2 flex flex-row gap-4">{buttons}</div>
    </Card>
  )
}
