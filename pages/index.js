import Head from "next/head";
import Header from "@components/Header";
import Footer from "@components/Footer";
import Main from "@components/Main";

export default function Index() {
  return (
    <div>
      <Head>
        <title>Powered by Census</title>
      </Head>

      <Header />
      <Main />
      <Footer />
    </div>
  );
}
