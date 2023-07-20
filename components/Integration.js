import { useState } from "react"

export default function Integration({
  name,
  description,
  type,
  apiKey,
  destinations,
  destinationConnectLinks,
}) {
  const [revoked, setRevoked] = useState(null)

  const destination = destinations.find((destination) => destination.type === type)
  const destinationConnectLink = destinationConnectLinks.find(
    (destinationConnectLink) =>
      destinationConnectLink.linkable_type === type && destinationConnectLink.id !== revoked,
  )

  const buttons = destination ? (
    <>
      <button
        className="rounded-md border border-sky-500 bg-sky-50 px-3 py-1 text-sky-500 shadow-sm"
        onClick={() => {}}
      >
        Configure
      </button>
    </>
  ) : destinationConnectLink ? (
    <>
      <button
        className="rounded-md border border-sky-500 bg-sky-50 px-3 py-1 text-sky-500 shadow-sm"
        onClick={() => {
          window.location.href = destinationConnectLink.uri
        }}
      >
        Continue connecting
      </button>
      <button
        className="rounded-md border border-sky-500 bg-sky-50 px-3 py-1 text-sky-500 shadow-sm"
        onClick={async () => {
          await fetch("/api/revoke_destination_connect_link", {
            method: "POST",
            headers: {
              ["authorization"]: `Bearer ${apiKey}`,
              ["content-type"]: "application/json",
            },
            body: JSON.stringify({
              id: destinationConnectLink.id,
            }),
          })
          setRevoked(destinationConnectLink.id)
        }}
      >
        Cancel
      </button>
    </>
  ) : (
    <>
      <button
        className="rounded-md border border-sky-500 bg-sky-50 px-3 py-1 text-sky-500 shadow-sm"
        onClick={async () => {
          const response = await fetch("/api/create_destination_connect_link", {
            method: "POST",
            headers: {
              ["authorization"]: `Bearer ${apiKey}`,
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
      className="flex flex-col gap-2 rounded-md border border-sky-100  data-[destination]:border-sky-300 bg-slate-50 px-4 py-3 shadow-sm"
      data-destination={destination ? "" : null}
    >
      <div
        className="font-medium text-slate-400 data-[destination]:text-sky-600"
        data-destination={destination ? "" : null}
      >
        {name}
        {destination ? null : " (not connected)"}
      </div>
      <div
        className="text-slate-300 data-[destination]:text-sky-800 mb-auto"
        data-destination={destination ? "" : null}
      >
        {description}
      </div>
      <div className="mt-2 flex flex-row gap-4">{buttons}</div>
    </div>
  )
}
