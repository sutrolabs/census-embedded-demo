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
      <main className="justify-self-center px-12 py-8">
        <Head>
          <title>Error - Census Embedded Demo App</title>
        </Head>
        <div className="text-lg text-red-500">{`${error}`}</div>
        {children}
      </main>
    )
  }
}
