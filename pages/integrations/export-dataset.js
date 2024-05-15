import Head from "next/head"
import { useState } from "react"

import Source from "@components/Source"
import Toggle from "@components/Toggle"

export default function ExportDataset({
  workspaceAccessToken,
  workspaceId,
  sources,
  setSources,
  refetchSources,
  sourceConnectLinks,
  sourceEmbedLinks,
  syncManagementLinks,
}) {
  const [embedSourceFlow, setEmbedSourceFlow] = useState(true)

  return (
    <>
      <Head>
        <title>Data Sources - Integrations - Census Embedded Demo App</title>
      </Head>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-stone-700">Integrations / Export Dataset</h2>
        <div className="flex items-center">
          <Toggle
            checked={embedSourceFlow}
            onChange={() => setEmbedSourceFlow((prevCheck) => !prevCheck)}
          ></Toggle>
          <span className="px-2">Embed</span>
        </div>
      </div>
      <hr className="border-t border-stone-400" />
      <p className="italic text-stone-500">
        <b>Note to customer:</b> On this page, the end user (your customer) can connect their source to your
        destination. Flip the &quot;Embed&quot; toggle above to swap between the embedded flow and redirect
        flow the end user can use to connect their source.
      </p>
      <p className="text-teal-400">Step 1: Connect your data source</p>
      <Source
        label="Redshift"
        type="redshift"
        iconClassName="fa-brands fa-amazon"
        workspaceAccessToken={workspaceAccessToken}
        workspaceId={workspaceId}
        sources={sources}
        setSources={setSources}
        refetchSources={refetchSources}
        sourceConnectLinks={sourceConnectLinks}
        sourceEmbedLinks={sourceEmbedLinks}
        embedSourceFlow={embedSourceFlow}
        syncManagementLinks={syncManagementLinks}
      />
      <Source
        label="BigQuery"
        type="big_query"
        iconClassName="fa-brands fa-google"
        workspaceAccessToken={workspaceAccessToken}
        workspaceId={workspaceId}
        sources={sources}
        setSources={setSources}
        refetchSources={refetchSources}
        sourceConnectLinks={sourceConnectLinks}
        sourceEmbedLinks={sourceEmbedLinks}
        embedSourceFlow={embedSourceFlow}
        syncManagementLinks={syncManagementLinks}
      />
      <Source
        label="GoogleSheets"
        type="google_sheets"
        iconClassName="fa-brands fa-google"
        workspaceAccessToken={workspaceAccessToken}
        workspaceId={workspaceId}
        sources={sources}
        setSources={setSources}
        refetchSources={refetchSources}
        sourceConnectLinks={sourceConnectLinks}
        sourceEmbedLinks={sourceEmbedLinks}
        embedSourceFlow={embedSourceFlow}
        syncManagementLinks={syncManagementLinks}
      />
      <Source
        label="Snowflake"
        type="snowflake"
        iconClassName="fa-solid fa-snowflake"
        workspaceAccessToken={workspaceAccessToken}
        workspaceId={workspaceId}
        sources={sources}
        setSources={setSources}
        refetchSources={refetchSources}
        sourceConnectLinks={sourceConnectLinks}
        sourceEmbedLinks={sourceEmbedLinks}
        embedSourceFlow={embedSourceFlow}
        syncManagementLinks={syncManagementLinks}
      />
    </>
  )
}
