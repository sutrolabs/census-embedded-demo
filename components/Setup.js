import Head from "next/head"

import TokenEntry from "@components/TokenEntry"

export function Setup({ workspaceAccessToken, setWorkspaceAccessToken }) {
  return (
    <>
      <Head>
        <title>API Setup - Census Embedded Demo App</title>
      </Head>
      <div className="grid min-h-screen place-items-center bg-slate-100 p-8">
        <div className="flex max-w-xl flex-col gap-6 rounded-md border  border-slate-200 bg-white px-10 py-8">
          <h1 className="text-2xl font-bold leading-none">Census Embedded API Setup</h1>
          <TokenEntry
            workspaceAccessToken={workspaceAccessToken}
            setWorkspaceAccessToken={setWorkspaceAccessToken}
          />
        </div>
      </div>
    </>
  )
}
