export default function Integration({
  name,
  description,
  type,
  apiKey,
  destinations,
  destinationConnectLinks,
}) {
  const destination = destinations.find((destination) => destination.type === type)
  const destinationConnectLink = destinationConnectLinks.find(
    (destinationConnectLink) => destinationConnectLink.type === type,
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
        onClick={() => {}}
      >
        Continue connecting
      </button>
      <button
        className="rounded-md border border-sky-500 bg-sky-50 px-3 py-1 text-sky-500 shadow-sm"
        onClick={() => {}}
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
    <div className="flex flex-col gap-2 rounded-md border border-sky-100 bg-slate-50 px-4 py-3 shadow-sm">
      <div className="font-medium text-slate-500">
        {name}
        {destination ? null : " (not connected)"}
      </div>
      <div className="text-slate-300">{description}</div>
      <div className="mt-2">{buttons}</div>
    </div>
  )
}
