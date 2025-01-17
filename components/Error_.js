import Head from "next/head"

export default function Error_({ error }) {
  return (
    <>
      <Head>
        <title>Error - Census Embedded Demo App</title>
      </Head>
      <h2 className="text-2xl font-bold text-neutral-700">Error</h2>
      <hr className="border-t border-neutral-400" />
      <p className="text-lg text-red-500">{`${error}`}</p>
    </>
  )
}
