import { useState } from "react"

import Button from "@components/Button"
import { Card } from "@components/Card"
import Toggle from "@components/Toggle"

export default function Destination({
  label,
  type,
  iconClassName,
  personalAccessToken,
  workspaceId,
  destinations,
  destinationConnectLinks,
  setDestinationConnectLinks,
  children,
}) {
  const [now] = useState(() => new Date())

  const destination = destinations.find((item) => item.type === type)
  const destinationConnectLink = destinationConnectLinks.find(
    (item) => item.type === type && new Date(item.expiration) > now && !item.revoked,
  )

  return (
    <Card className="flex flex-col gap-4" disabled={!destination}>
      <h3 className="flex flex-row justify-between">
        <span
          className="flex flex-row items-center gap-2 text-lg font-medium text-stone-500 data-[enabled]:text-teal-900"
          data-enabled={destination ? "" : null}
        >
          <i className={iconClassName} />
          {label}
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
                const response = await fetch("/api/revoke_destination_connect_link", {
                  method: "POST",
                  headers: {
                    ["authorization"]: `Bearer ${personalAccessToken}`,
                    ["content-type"]: "application/json",
                  },
                  body: JSON.stringify({
                    workspaceId,
                    id: destinationConnectLink.id,
                  }),
                })
                const data = await response.json()
                setDestinationConnectLinks(
                  destinationConnectLinks.map((item) =>
                    item.id === destinationConnectLink.id ? data : item,
                  ),
                )
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
                  ["content-type"]: "application/json",
                },
                body: JSON.stringify({
                  workspaceId,
                  type,
                }),
              })
              const data = await response.json()
              window.location.href = data.uri
            }}
          />
        )}
      </h3>
      {destination ? children : null}
    </Card>
  )
}
