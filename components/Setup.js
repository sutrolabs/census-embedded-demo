import Head from "next/head"

import TokenEntry from "@components/TokenEntry"
// import WorkspaceSelect from "@components/WorkspaceSelect"

export function Setup({
  workspaceAccessToken,
  setWorkspaceAccessToken,
  setWorkspaceId,
}) {
  return (
    <div className="flex max-w-xl flex-col gap-6 rounded-md border-2 border-indigo-500 bg-white px-10 py-8 shadow-md">
      <Head>
        <title>API Setup - Census Embedded Demo App</title>
      </Head>

      <h1 className="text-2xl font-bold text-indigo-700">Census Embedded API Setup</h1>
      <TokenEntry
        workspaceAccessToken={workspaceAccessToken}
        setWorkspaceAccessToken={setWorkspaceAccessToken}
        setWorkspaceId={setWorkspaceId}
      />
      <hr className="border-t border-stone-400" />
    </div>
  )
}
