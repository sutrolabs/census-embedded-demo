import Head from "next/head"
import { useContext, useEffect } from "react"

import Source from "@components/Source"
import { IntegrationsContext } from "@contexts/IntegrationsContext"
import { destinationLabel, destinationObject } from "@utils/preset_source_destination"

export default function ImportDataset({
  workspaceAccessToken,
  dd,
  sources,
  setSources,
  destinations,
  refetchSyncs,
  refetchSources,
  sourceConnectLinks,
  refetchSourceConnectLinks,
  sourceEmbedLinks,
  syncManagementLinks,
  refetchSyncManagementLinks,
  syncs,
  setSyncs,
  runsLoading,
  runs,
  embedMode,
  devMode,
}) {
  const { setDestinationHidden, setDestination, setSourceHidden, setSource } = useContext(IntegrationsContext)

  useEffect(() => {
    // Remove any previously set state from other pages
    setSource(null)
    setSourceHidden(false)

    const presetDestination = destinations.find((d) => d.name == destinationLabel)
    if (!presetDestination) {
      setDestination(null)
      setDestinationHidden(false)
    } else {
      setDestination({
        connection_id: presetDestination.id,
        object_name: destinationObject,
      })
      setDestinationHidden(true)
    }
  }, [setSource, setSourceHidden, destinations, setDestination, setDestinationHidden])

  return (
    <>
      <Head>
        <title>Data Sources - Integrations - Census Embedded Demo App</title>
      </Head>
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <h2 className="text-2xl font-bold text-stone-700">Integrations / Import Dataset</h2>
      </div>
      <hr className="border-t border-stone-400" />
      <p className="italic text-stone-500">
        <b>Note to customer:</b> On this page, the end user (your customer) can connect their source to your
        destination.
      </p>
      <p className="text-teal-400">Step 1: Connect your data source</p>
      <Source
        label="Redshift"
        type="redshift"
        iconClassName="fa-brands fa-aws"
        workspaceAccessToken={workspaceAccessToken}
        sources={sources}
        destinations={destinations}
        setSources={setSources}
        refetchSources={refetchSources}
        refetchSourceConnectLinks={refetchSourceConnectLinks}
        sourceConnectLinks={sourceConnectLinks}
        sourceEmbedLinks={sourceEmbedLinks}
        embedMode={embedMode}
        devMode={devMode}
        syncManagementLinks={syncManagementLinks}
        refetchSyncManagementLinks={refetchSyncManagementLinks}
        syncs={syncs}
        setSyncs={setSyncs}
        refetchSyncs={refetchSyncs}
        runsLoading={runsLoading}
        runs={runs}
      />
      <Source
        label="BigQuery"
        type="big_query"
        iconClassName="fa-brands fa-google"
        workspaceAccessToken={workspaceAccessToken}
        sources={sources}
        destinations={destinations}
        setSources={setSources}
        refetchSources={refetchSources}
        sourceConnectLinks={sourceConnectLinks}
        refetchSourceConnectLinks={refetchSourceConnectLinks}
        sourceEmbedLinks={sourceEmbedLinks}
        embedMode={embedMode}
        devMode={devMode}
        syncManagementLinks={syncManagementLinks}
        refetchSyncManagementLinks={refetchSyncManagementLinks}
        syncs={syncs}
        setSyncs={setSyncs}
        refetchSyncs={refetchSyncs}
        runsLoading={runsLoading}
        runs={runs}
      />
      <Source
        label="GoogleSheets"
        type="google_sheets"
        iconClassName="fa-brands fa-google"
        workspaceAccessToken={workspaceAccessToken}
        sources={sources}
        destinations={destinations}
        setSources={setSources}
        refetchSources={refetchSources}
        sourceConnectLinks={sourceConnectLinks}
        refetchSourceConnectLinks={refetchSourceConnectLinks}
        sourceEmbedLinks={sourceEmbedLinks}
        embedMode={embedMode}
        devMode={devMode}
        syncManagementLinks={syncManagementLinks}
        refetchSyncManagementLinks={refetchSyncManagementLinks}
        syncs={syncs}
        setSyncs={setSyncs}
        refetchSyncs={refetchSyncs}
        runsLoading={runsLoading}
        runs={runs}
      />
      <Source
        label="Snowflake"
        type="snowflake"
        iconClassName="fa-solid fa-snowflake"
        workspaceAccessToken={workspaceAccessToken}
        sources={sources}
        destinations={destinations}
        setSources={setSources}
        refetchSources={refetchSources}
        sourceConnectLinks={sourceConnectLinks}
        refetchSourceConnectLinks={refetchSourceConnectLinks}
        sourceEmbedLinks={sourceEmbedLinks}
        embedMode={embedMode}
        devMode={devMode}
        syncManagementLinks={syncManagementLinks}
        refetchSyncManagementLinks={refetchSyncManagementLinks}
        syncs={syncs}
        setSyncs={setSyncs}
        refetchSyncs={refetchSyncs}
        runsLoading={runsLoading}
        runs={runs}
      />
    </>
  )
}
