import Head from "next/head"

import TokenEntry from "@components/TokenEntry"

export function Setup({ workspaceAccessToken, onSubmit }) {
  return (
    <>
      <Head>
        <title>API Setup - Census Embedded Demo App</title>
      </Head>
      <div className="grid min-h-screen place-items-center bg-stone-200 p-8">
        <div className="flex max-w-xl flex-col gap-6 rounded-md border-2 border-indigo-500 bg-white px-10 py-8 shadow-md">
          <h1 className="text-2xl font-bold text-indigo-700">Census Embedded API Setup</h1>
          <TokenEntry workspaceAccessToken={workspaceAccessToken} onSubmit={onSubmit} />
          <hr className="border-t border-stone-400" />
        </div>
      </div>
    </>
  )
}
