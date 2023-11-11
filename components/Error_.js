import Head from "next/head"

export default function Error_({ setup, error, children }) {
  if (setup) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-md border border-red-500 bg-stone-50 px-10 py-8 shadow-sm">
        <Head>
          <title>Error - Census Embedded Demo App</title>
        </Head>
        <div className="text-lg text-red-700">{`${error}`}</div>
        {children}
      </div>
    )
  } else {
    return (
      <>
        <Head>
          <title>Error - Census Embedded Demo App</title>
        </Head>
        <h2 className="text-2xl font-bold text-stone-700">Error</h2>
        <hr className="border-t border-stone-400" />
        <p className="text-lg text-red-500">{`${error}`}</p>
        {children}
      </>
    )
  }
}
