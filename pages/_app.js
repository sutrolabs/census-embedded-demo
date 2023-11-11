import "@styles/globals.css"
import dynamic from "next/dynamic"
import { useSessionStorage } from "usehooks-ts"

import Footer from "@components/Footer"
import Header from "@components/Header"
import LogIn from "@components/LogIn"
import SetupLayout from "@components/SetupLayout"
import Sidebar from "@components/Sidebar"
import TokenEntry from "@components/TokenEntry"
import WorkspaceSelect from "@components/WorkspaceSelect"

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
          <Component personalAccessToken={personalAccessToken} workspaceId={workspaceId} {...pageProps} />
        </>
      )}
      <Footer />
    </>
  )
}

export default dynamic(() => Promise.resolve(Application), {
  ssr: false,
})
