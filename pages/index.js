import dynamic from "next/dynamic"
import Head from "next/head"
import { useSessionStorage } from "usehooks-ts"

import Footer from "@components/Footer"
import Header from "@components/Header"
import Login from "@components/Login"
import Workspace from "@components/Workspace"

function Index() {
  const [apiKey, setApiKey] = useSessionStorage("census-api-key", null)

  return (
    <>
      <Head>
        <title>Powered by Census</title>
      </Head>

      <Header apiKey={apiKey} setApiKey={setApiKey} />
      {apiKey ? <Workspace apiKey={apiKey} /> : <Login setApiKey={setApiKey} />}
      <Footer />
    </>
  )
}

export default dynamic(() => Promise.resolve(Index), {
  ssr: false,
})
