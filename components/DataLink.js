import sortBy from "lodash/sortBy"
import { useState } from "react"
import { useFetch } from "usehooks-ts"

import Destination from "@components/Destination"
import DestinationConnectLink from "@components/DestinationConnectLink"
import Error_ from "@components/Error_"
import Loading from "@components/Loading"

export default function DataLink({ apiKey }) {
  const [refresh, setRefresh] = useState(0)
  const { error: destinationsError, data: destinationsData } = useFetch(
    `/api/list_destinations?refresh=${refresh}`,
    {
      method: "GET",
      headers: {
        ["authorization"]: `Bearer ${apiKey}`,
      },
    },
  )
  const { error: destinationConnectLinksError, data: destinationConnectLinksData } = useFetch(
    `/api/list_destination_connect_links?refresh=${refresh}`,
    {
      method: "GET",
      headers: {
        ["authorization"]: `Bearer ${apiKey}`,
      },
    },
  )

  if (destinationsError || destinationConnectLinksError) {
    return <Error_ />
  } else if (!destinationsData || !destinationConnectLinksData) {
    return <Loading />
  }

  return (
    <main className="flex flex-col gap-2 px-6 py-5">
      <div className="flex flex-row gap-2">
        <span>You have {destinationsData.length + destinationConnectLinksData.length} destinations</span>
        <button className="self-center border border-gray-500" onClick={() => setRefresh(refresh + 1)}>
          Refresh
        </button>
      </div>
      {sortBy(destinationsData, (destination) => destination.name.toLowerCase()).map((destination) => (
        <Destination key={destination.id} destination={destination} />
      ))}
      {sortBy(destinationConnectLinksData, (destinationConnectLink) =>
        destinationConnectLink.linkable_type.toLowerCase(),
      ).map((destinationConnectLink) => (
        <DestinationConnectLink
          key={destinationConnectLink.id}
          destinationConnectLink={destinationConnectLink}
        />
      ))}
    </main>
  )
}
