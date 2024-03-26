import Head from "next/head"

import Source from "@components/Source"

export default function Sources({
  personalAccessToken,
  workspaceId,
  sources,
  setSources,
  sourceConnectLinks,
}) {
  return (
    <>
      <Head>
        <title>Data Sources - Integrations - Census Embedded Demo App</title>
      </Head>
      <h2 className="text-2xl font-bold text-stone-700">Integrations / Data Sources</h2>
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
      />
    </>
  )
}
