import sortBy from "lodash/sortBy"
import { useState } from "react"
import { useFetch } from "usehooks-ts"

import Destination from "@components/Destination"
import Error_ from "@components/Error_"
import Loading from "@components/Loading"

export default function Workspace({ apiKey }) {
  const [refresh, setRefresh] = useState(0)
  const { error, data } = useFetch(`/api/list-destinations?refresh=${refresh}`, {
    method: "GET",
    headers: {
      ["authorization"]: `Bearer ${apiKey}`,
    },
  })

  if (error) {
    return <Error_ />
  } else if (!data) {
    return <Loading />
  }

  return (
    <main className="m-2 flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <span>You have {data.length} destinations</span>
        <button className="self-center border border-gray-500" onClick={() => setRefresh(refresh + 1)}>
          Refresh
        </button>
      </div>
      {sortBy(data, (destination) => destination.name.toLowerCase()).map((destination) => (
        <Destination key={destination.id} destination={destination} />
      ))}
    </main>
  )
}
