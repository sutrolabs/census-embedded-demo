import "@styles/globals.css"

import { LinearScale, CategoryScale, LineElement } from "chart.js"
import { PointElement, Tooltip, registry } from "chart.js"
import dynamic from "next/dynamic"

import Error_ from "@components/Message/Error_"
import Loading from "@components/Message/Loading"
import Sidebar from "@components/Navigation/Sidebar/Sidebar"
import { Setup } from "@components/Setup"
import MainLayout from "@components/Structural/Layouts/MainLayout"
import { useCensusEmbedded, CensusEmbeddedProvider } from "@providers/CensusEmbeddedProvider"
import { useBasicFetch } from "@utils/fetch"

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

function MainApplication({ Component, pageProps }) {
  const {
    workspaceAccessToken,
    embedMode,
    setEmbedMode,
    devMode,
    setDevMode,
    logOut,
    isLoading,
    hasError,
    error,
    syncs,
    runs,
    runsLoading,
  } = useCensusEmbedded()

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

  let component
  if (hasError) {
    component = <Error_ error={error} />
  } else if (isLoading) {
    // Runs aren't critical, so it's OK to show the UI without them
    component = <Loading />
  } else {
    component = <Component {...pageProps} />
  }

  return (
    <main className="relative flex h-screen w-screen flex-row overflow-hidden">
      <Sidebar
        syncsLoading={syncs.loading}
        syncs={syncs.data || []}
        runsLoading={runsLoading}
        runs={runs}
        onLogOut={logOut}
      />
      <MainLayout>{component}</MainLayout>
    </main>
  )
}
