import "@styles/globals.css"
import { PointElement, Tooltip, registry } from "chart.js"
import { LinearScale, CategoryScale, LineElement } from "chart.js"
import dynamic from "next/dynamic"
import { useSessionStorage } from "usehooks-ts"

import Footer from "@components/Footer"
import Header from "@components/Header"
import LogIn from "@components/LogIn"
import MainLayout from "@components/MainLayout"
import SetupLayout from "@components/SetupLayout"
import Sidebar from "@components/Sidebar"
import TokenEntry from "@components/TokenEntry"
import WorkspaceSelect from "@components/WorkspaceSelect"

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
        <>
          <Sidebar />
          <MainLayout>
            <Component personalAccessToken={personalAccessToken} workspaceId={workspaceId} {...pageProps} />
          </MainLayout>
        </>
      )}
      <Footer />
    </>
  )
}

export default dynamic(() => Promise.resolve(Application), {
  ssr: false,
})
