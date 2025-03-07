import "@styles/globals.css"
import { LinearScale, CategoryScale, LineElement } from "chart.js"
import { PointElement, Tooltip, registry } from "chart.js"
import dynamic from "next/dynamic"

import Error_ from "@components/Error_"
import DevModeHoverCardManager from "@components/HoverCard/DevModeHoverCardManager"
import Loading from "@components/Loading"
import MainLayout from "@components/MainLayout"
import Sidebar from "@components/Navigation/Sidebar/Sidebar"
import { Setup } from "@components/Setup"
import { useCensusEmbedded, CensusEmbeddedProvider } from "@providers/CensusEmbeddedProvider"
import { useBasicFetch, useFetchRuns } from "@utils/fetch"

registry.add(LineElement)
registry.add(PointElement)
registry.add(LinearScale)
registry.add(CategoryScale)
registry.add(Tooltip)

function Application({ Component, pageProps }) {
  return (
    <CensusEmbeddedProvider>
      <ApplicationContent Component={Component} pageProps={pageProps} />
    </CensusEmbeddedProvider>
  )
}

function ApplicationContent({ Component, pageProps }) {
  const { workspaceAccessToken, logOut } = useCensusEmbedded()

  if (!workspaceAccessToken) {
    return <Setup />
  }

  return <MainApplication Component={Component} pageProps={pageProps} />
}

export default dynamic(() => Promise.resolve(Application), {
  ssr: false,
})

function MainApplication({ Component, pageProps, onLogOut }) {
  const { embedMode, setEmbedMode, devMode, setDevMode, workspaceAccessToken } = useCensusEmbedded()

  const {
    loading: destinationsLoading,
    error: destinationsError,
    data: destinations,
    setData: setDestinations,
  } = useBasicFetch(
    () =>
      new Request(`/api/list_destinations`, {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
        },
      }),
  )
  const {
    loading: destinationConnectLinksLoading,
    error: destinationConnectLinksError,
    data: destinationConnectLinks,
    setData: setDestinationConnectLinks,
  } = useBasicFetch(
    () =>
      new Request(`/api/list_destination_connect_links`, {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
        },
      }),
  )
  const {
    loading: sourcesLoading,
    error: sourcesError,
    data: sources,
    setData: setSources,
    refetchInBackground: refetchSources,
  } = useBasicFetch(
    () =>
      new Request(`/api/list_sources`, {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
        },
      }),
  )
  const {
    loading: sourceConnectLinksLoading,
    error: sourceConnectLinksError,
    data: sourceConnectLinks,
    setData: setSourceConnectLinks,
    refetchInBackground: refetchSourceConnectLinks,
  } = useBasicFetch(
    () =>
      new Request(`/api/list_source_connect_links`, {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
        },
      }),
  )
  const {
    loading: syncManagementLinksLoading,
    error: syncManagementLinksError,
    data: syncManagementLinks,
    setData: setSyncManagementLinks,
    refetchInBackground: refetchSyncManagementLinks,
  } = useBasicFetch(
    () =>
      new Request(`/api/list_sync_management_links`, {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
        },
      }),
  )
  const {
    loading: syncsLoading,
    error: syncsError,
    data: syncs,
    setData: setSyncs,
    refetchInBackground: refetchSyncs,
  } = useBasicFetch(
    () =>
      new Request(`/api/list_syncs`, {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
        },
      }),
  )

  const {
    loading: segmentsLoading,
    error: segmentsError,
    data: segments,
    setData: setSegments,
    refetchInBackground: refetchSegments,
  } = useBasicFetch(
    () =>
      new Request(`/api/list_segments`, {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
        },
      }),
  )
  const { runsLoading, runsError, runs } = useFetchRuns(workspaceAccessToken, syncsLoading, syncs)

  const anyError =
    destinationsError ??
    destinationConnectLinksError ??
    sourcesError ??
    sourceConnectLinksError ??
    syncManagementLinksError ??
    syncsError ??
    segmentsError ??
    runsError
  const anyLoading =
    destinationsLoading ||
    destinationConnectLinksLoading ||
    sourcesLoading ||
    sourceConnectLinksLoading ||
    syncManagementLinksLoading ||
    syncsLoading ||
    segmentsLoading
  let component
  if (anyError) {
    component = <Error_ error={anyError} />
  } else if (anyLoading) {
    // Runs aren't critical, so it's OK to show the UI without them
    component = <Loading />
  } else {
    component = (
      <Component
        workspaceAccessToken={workspaceAccessToken}
        destinations={destinations}
        setDestinations={setDestinations}
        destinationConnectLinks={destinationConnectLinks}
        setDestinationConnectLinks={setDestinationConnectLinks}
        sources={sources}
        setSources={setSources}
        refetchSources={refetchSources}
        sourceConnectLinks={sourceConnectLinks}
        refetchSourceConnectLinks={refetchSourceConnectLinks}
        setSourceConnectLinks={setSourceConnectLinks}
        syncManagementLinks={syncManagementLinks}
        refetchSyncManagementLinks={refetchSyncManagementLinks}
        setSyncManagementLinks={setSyncManagementLinks}
        syncs={syncs}
        setSyncs={setSyncs}
        refetchSyncs={refetchSyncs}
        segments={segments}
        setSegments={setSegments}
        refetchSegments={refetchSegments}
        runsLoading={runsLoading}
        runs={runs}
        embedMode={embedMode}
        setEmbedMode={setEmbedMode}
        devMode={devMode}
        setDevMode={setDevMode}
        {...pageProps}
      />
    )
  }

  return (
    <main className="relative flex h-screen w-screen flex-row overflow-hidden">
      <Sidebar syncsLoading={syncsLoading} syncs={syncs} runsLoading={runsLoading} runs={runs} />
      <MainLayout>{component}</MainLayout>
      <DevModeHoverCardManager />
    </main>
  )
}
