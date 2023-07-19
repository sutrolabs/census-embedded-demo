import dynamic from "next/dynamic"
import Head from "next/head"
import { useSessionStorage } from "usehooks-ts"

import Footer from "@components/Footer"
import Header from "@components/Header"
import JokeBlock from "@components/JokeBlock"
import Login from "@components/Login"

function Index() {
  const [apiKey, setApiKey] = useSessionStorage("census-api-key", null)

  return (
    <>
      <Head>
        <title>Powered by Census</title>
      </Head>

      <Header apiKey={apiKey} setApiKey={setApiKey} />
      <main>{apiKey ? <JokeBlock apiKey={apiKey} /> : <Login setApiKey={setApiKey} />}</main>
      <Footer />
    </>
  )
}

export default dynamic(() => Promise.resolve(Index), {
  ssr: false,
})
