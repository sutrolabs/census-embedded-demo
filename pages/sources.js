import Head from "next/head"
import { useState } from "react"

import Source from "@components/Source"
import Toggle from "@components/Toggle"

export default function Sources({
  personalAccessToken,
  workspaceId,
  sources,
  setSources,
  sourceConnectLinks,
}) {
  const [embedSourceFlow, setEmbedSourceFlow] = useState(true)

  return (
    <>
      <Head>
        <title>Data Sources - Integrations - Census Embedded Demo App</title>
      </Head>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-stone-700">Integrations / Data Sources</h2>
        <div className="flex items-center">
          <Toggle
            checked={embedSourceFlow}
            onChange={() => setEmbedSourceFlow((prevCheck) => !prevCheck)}
          ></Toggle>
          <span className="px-2">Embed</span>
        </div>
      </div>
      <hr className="border-t border-stone-400" />
      <p className="italic text-stone-500">Define the datasets that matter to you</p>
      <p className="text-teal-400">Step 1: Connect your data source</p>
      <Source
        label="Redshift"
        type="redshift"
        iconClassName="fa-brands fa-amazon"
        personalAccessToken={personalAccessToken}
        workspaceId={workspaceId}
        sources={sources}
        setSources={setSources}
        sourceConnectLinks={sourceConnectLinks}
        embedSourceFlow={embedSourceFlow}
      />
      <Source
        label="BigQuery"
        type="big_query"
        iconClassName="fa-brands fa-google"
        personalAccessToken={personalAccessToken}
        workspaceId={workspaceId}
        sources={sources}
        setSources={setSources}
        sourceConnectLinks={sourceConnectLinks}
        embedSourceFlow={embedSourceFlow}
      />
      <Source
        label="Snowflake"
        type="snowflake"
        iconClassName="fa-solid fa-snowflake"
        personalAccessToken={personalAccessToken}
        workspaceId={workspaceId}
        sources={sources}
        setSources={setSources}
        sourceConnectLinks={sourceConnectLinks}
        embedSourceFlow={embedSourceFlow}
      />
    </>
  )
}
