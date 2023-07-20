import dynamic from "next/dynamic"
import Head from "next/head"
import { useSessionStorage } from "usehooks-ts"

import DataLink from "@components/DataLink"
import Footer from "@components/Footer"
import Header from "@components/Header"
import Login from "@components/Login"
import Sidebar from "@components/Sidebar"

function Index() {
  const [apiKey, setApiKey] = useSessionStorage("census-api-key", null)

  return (
    <>
      <Head>
        <title>Market Data Inc.</title>
      </Head>

      <Header apiKey={apiKey} setApiKey={setApiKey} />

      {apiKey ? (
        <>
          <Sidebar />
          <DataLink apiKey={apiKey} />
        </>
      ) : (
        <Login setApiKey={setApiKey} />
      )}
      <Footer />
    </>
  )
}

export default dynamic(() => Promise.resolve(Index), {
  ssr: false,
})
