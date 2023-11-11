import Head from "next/head"

export default function Loading({ setup }) {
  if (setup) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-md bg-stone-50 px-10 py-8 shadow-md">
        <Head>
          <title>Loading... - Census Embedded Demo App</title>
        </Head>

        <div className="text-teal-600">Loading...</div>
      </div>
    )
  } else {
    return (
      <>
        <Head>
          <title>Loading... - Census Embedded Demo App</title>
        </Head>
        <h2 className="text-2xl text-stone-300">Loading...</h2>
      </>
    )
  }
}
