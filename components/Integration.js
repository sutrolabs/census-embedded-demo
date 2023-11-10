import { useState } from "react"

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
      <button
        className="rounded-md border border-sky-600 bg-sky-50 px-3 py-1 text-sky-600 shadow-sm"
        onClick={() => {}}
      >
        Configure
      </button>
    </>
  ) : destinationConnectLink ? (
    <>
      <button
        className="rounded-md border border-sky-600 bg-sky-50 px-3 py-1 text-sky-600 shadow-sm"
        onClick={() => {
          window.location.href = destinationConnectLink.uri
        }}
      >
        Continue connecting
      </button>
      <button
        className="rounded-md border border-sky-600 bg-sky-50 px-3 py-1 text-sky-600 shadow-sm"
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
      </button>
    </>
  ) : (
    <>
      <button
        className="rounded-md border border-sky-600 bg-sky-50 px-3 py-1 text-sky-600 shadow-sm"
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
      </button>
    </>
  )
  return (
    <div
      className="flex flex-col gap-2 rounded-md border border-sky-100  bg-slate-50 px-4 py-3 shadow-sm data-[destination]:border-sky-300"
      data-destination={destination ? "" : null}
    >
      <div className="flex flex-row items-center justify-between">
        <span
          className="text-slate-400 data-[destination]:text-sky-600"
          data-destination={destination ? "" : null}
        >
          {name}
        </span>
        <span
          className="rounded-lg bg-slate-200 px-2 py-1 text-xs text-slate-400 data-[destination]:bg-green-200 data-[destination]:text-green-600"
          data-destination={destination ? "" : null}
        >
          {destination ? "connected" : "not connected"}
        </span>
      </div>
      <div
        className="mb-auto text-slate-300 data-[destination]:text-sky-800"
        data-destination={destination ? "" : null}
      >
        {description}
      </div>
      <div className="mt-2 flex flex-row gap-4">{buttons}</div>
    </div>
  )
}
