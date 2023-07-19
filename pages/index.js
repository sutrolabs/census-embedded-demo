import Head from "next/head";
import dynamic from "next/dynamic";
import Header from "@components/Header";
import Footer from "@components/Footer";
import { useSessionStorage } from "usehooks-ts";
import Login from "@components/Login";
import JokeBlock from "@components/JokeBlock";

function Index() {
  const [apiKey, setApiKey] = useSessionStorage("census-api-key", null);

  return (
    <>
      <Head>
        <title>Powered by Census</title>
      </Head>

      <Header apiKey={apiKey} setApiKey={setApiKey} />
      <main>
        {apiKey ? (
          <JokeBlock apiKey={apiKey} />
        ) : (
          <Login setApiKey={setApiKey} />
        )}
      </main>
      <Footer />
    </>
  );
}

export default dynamic(() => Promise.resolve(Index), {
  ssr: false,
});
