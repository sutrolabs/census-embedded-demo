import Head from "next/head";
import Header from "@components/Header";
import Footer from "@components/Footer";
import JokeBlock from "@components/JokeBlock";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Powered by Census</title>
      </Head>

      <main>
        <Header title="Powered by Census" />
        <hr />
        <JokeBlock />
      </main>
      <Footer />
    </div>
  );
}
