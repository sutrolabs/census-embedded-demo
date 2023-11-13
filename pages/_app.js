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
import SetupLayout from "@components/SetupLayout"
import Sidebar from "@components/Sidebar"
import TokenEntry from "@components/TokenEntry"
import WorkspaceSelect from "@components/WorkspaceSelect"
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

      {!personalAccessToken ? (
        <SetupLayout>
          <TokenEntry setPersonalAccessToken={setPersonalAccessToken} />
        </SetupLayout>
      ) : !workspaceId ? (
        <SetupLayout>
          <WorkspaceSelect
            personalAccessToken={personalAccessToken}
            setWorkspaceId={setWorkspaceId}
            onBack={() => {
              setPersonalAccessToken(null)
            }}
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
      new Request("/api/list_destinations", {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${personalAccessToken}`,
          ["census-workspace-id"]: `${workspaceId}`,
        },
      }),
  )
  const {
    error: destinationConnectLinksError,
    data: destinationConnectLinks,
    setData: setDestinationConnectLinks,
  } = useBasicFetch(
    () =>
      new Request("/api/list_destination_connect_links", {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${personalAccessToken}`,
          ["census-workspace-id"]: `${workspaceId}`,
        },
      }),
  )

  let component
  if (destinationsError || destinationConnectLinksError) {
    component = <Error_ error={destinationsError ?? destinationConnectLinksError} />
  } else if (!destinations || !destinationConnectLinks) {
    component = <Loading />
  } else {
    component = (
      <Component
        personalAccessToken={personalAccessToken}
        workspaceId={workspaceId}
        destinations={destinations}
        destinationConnectLinks={destinationConnectLinks}
        setDestinationConnectLinks={setDestinationConnectLinks}
        {...pageProps}
      />
    )
  }

  return (
    <>
      <Sidebar destinations={destinations} destinationConnectLinks={destinationConnectLinks} />
      <MainLayout>{component}</MainLayout>
    </>
  )
}
