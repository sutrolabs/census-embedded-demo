import "@styles/globals.css"

import { LinearScale, CategoryScale, LineElement } from "chart.js"
import { PointElement, Tooltip, registry } from "chart.js"
import dynamic from "next/dynamic"
import { useSessionStorage } from "usehooks-ts"

import Error_ from "@components/Error_"
import Footer from "@components/Footer"
import Header from "@components/Header"
import Loading from "@components/Loading"
import LogIn from "@components/LogIn"
import MainLayout from "@components/MainLayout"
import { Setup } from "@components/Setup"
import SetupLayout from "@components/SetupLayout"
import Sidebar from "@components/Sidebar"
import { useBasicFetch, useFetchRuns } from "@utils/fetch"

registry.add(LineElement)
registry.add(PointElement)
registry.add(LinearScale)
registry.add(CategoryScale)
registry.add(Tooltip)

function Application({ Component, pageProps }) {
  const [workspaceAccessToken, setWorkspaceAccessToken] = useSessionStorage("census_api_token", null)
  const [workspaceId, setWorkspaceId] = useSessionStorage("census-workspace-id", null)
  const [loggedIn, setLoggedIn] = useSessionStorage("census-logged-in", false)

  return (
    <>
      <Header
        loggedIn={loggedIn}
        onLogOut={() => {
          setWorkspaceAccessToken(null)
          setWorkspaceId(null)
          setLoggedIn(false)
        }}
      />

      {!workspaceId ?? !workspaceAccessToken ? (
        <SetupLayout>
          <Setup
            workspaceAccessToken={workspaceAccessToken}
            setWorkspaceAccessToken={setWorkspaceAccessToken}
            setWorkspaceId={setWorkspaceId}
          />
        </SetupLayout>
      ) : !loggedIn ? (
        <SetupLayout>
          <LogIn onLogIn={() => setLoggedIn(true)} />
        </SetupLayout>
      ) : (
        <MainApplication
          Component={Component}
          pageProps={pageProps}
          workspaceAccessToken={workspaceAccessToken}
          workspaceId={workspaceId}
        />
      )}
      <Footer />
    </>
  )
}

export default dynamic(() => Promise.resolve(Application), {
  ssr: false,
})

function MainApplication({ Component, pageProps, workspaceAccessToken, workspaceId }) {
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
  } = useBasicFetch(
    () =>
      new Request(`/api/list_syncs`, {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
        },
      }),
  )
  const { runsLoading, runsError, runs } = useFetchRuns(
    workspaceAccessToken,
    workspaceId,
    syncsLoading,
    syncs,
  )

  const refetchSources = async () => {
    const response = await fetch("/api/list_sources", {
      method: "GET",
      headers: {
        ["authorization"]: `Bearer ${workspaceAccessToken}`,
      },
    })
    const data = await response.json()
    setSources(data)
  }

  const anyError =
    destinationsError ??
    destinationConnectLinksError ??
    sourcesError ??
    sourceConnectLinksError ??
    syncManagementLinksError ??
    syncsError ??
    runsError
  const anyLoading =
    destinationsLoading ||
    destinationConnectLinksLoading ||
    sourcesLoading ||
    sourceConnectLinksLoading ||
    syncManagementLinksLoading ||
    syncsLoading
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
        workspaceId={workspaceId}
        destinations={destinations}
        setDestinations={setDestinations}
        destinationConnectLinks={destinationConnectLinks}
        setDestinationConnectLinks={setDestinationConnectLinks}
        sources={sources}
        setSources={setSources}
        refetchSources={refetchSources}
        sourceConnectLinks={sourceConnectLinks}
        setSourceConnectLinks={setSourceConnectLinks}
        syncManagementLinks={syncManagementLinks}
        setSyncManagementLinks={setSyncManagementLinks}
        syncs={syncs}
        setSyncs={setSyncs}
        runsLoading={runsLoading}
        runs={runs}
        {...pageProps}
      />
    )
  }

  return (
    <>
      <Sidebar syncsLoading={syncsLoading} syncs={syncs} runsLoading={runsLoading} runs={runs} />
      <MainLayout>{component}</MainLayout>
    </>
  )
}
