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
import { useBasicFetch } from "@utils/fetch"

registry.add(LineElement)
registry.add(PointElement)
registry.add(LinearScale)
registry.add(CategoryScale)
registry.add(Tooltip)

function Application({ Component, pageProps }) {
  const [personalAccessToken, setPersonalAccessToken] = useSessionStorage(
    "census-personal-access-token",
    null,
  )
  const [workspaceId, setWorkspaceId] = useSessionStorage("census-workspace-id", null)
  const [loggedIn, setLoggedIn] = useSessionStorage("census-logged-in", false)

  return (
    <>
      <Header
        loggedIn={loggedIn}
        onLogOut={() => {
          setPersonalAccessToken(null)
          setWorkspaceId(null)
          setLoggedIn(false)
        }}
      />

      {!personalAccessToken || !workspaceId ? (
        <SetupLayout>
          <Setup
            personalAccessToken={personalAccessToken}
            setPersonalAccessToken={setPersonalAccessToken}
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
          personalAccessToken={personalAccessToken}
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

function MainApplication({ Component, pageProps, personalAccessToken, workspaceId }) {
  const { error: destinationsError, data: destinations } = useBasicFetch(
    () =>
      new Request(`/api/list_destinations?workspaceId=${workspaceId}`, {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${personalAccessToken}`,
        },
      }),
  )
  const {
    error: destinationConnectLinksError,
    data: destinationConnectLinks,
    setData: setDestinationConnectLinks,
  } = useBasicFetch(
    () =>
      new Request(`/api/list_destination_connect_links?workspaceId=${workspaceId}`, {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${personalAccessToken}`,
        },
      }),
  )
  const {
    error: syncsError,
    data: syncs,
    setData: setSyncs,
  } = useBasicFetch(
    () =>
      new Request(`/api/list_syncs?workspaceId=${workspaceId}`, {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${personalAccessToken}`,
        },
      }),
  )

  const anyError = destinationsError ?? destinationConnectLinksError ?? syncsError
  const anyLoading = !destinations || !destinationConnectLinks || !syncs
  let component
  if (anyError) {
    component = <Error_ error={anyError} />
  } else if (anyLoading) {
    component = <Loading />
  } else {
    component = (
      <Component
        personalAccessToken={personalAccessToken}
        workspaceId={workspaceId}
        destinations={destinations}
        destinationConnectLinks={destinationConnectLinks}
        setDestinationConnectLinks={setDestinationConnectLinks}
        syncs={syncs}
        setSyncs={setSyncs}
        {...pageProps}
      />
    )
  }

  return (
    <>
      <Sidebar syncs={syncs} />
      <MainLayout>{component}</MainLayout>
    </>
  )
}
