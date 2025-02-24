import Head from "next/head"

import Button from "@components/Button"
import TokenEntry from "@components/TokenEntry"

export function Setup({ workspaceAccessToken, setWorkspaceAccessToken }) {
  return (
    <>
      <Head>
        <title>API Setup</title>
      </Head>
      <div className="relative z-50 flex h-screen flex-row overflow-hidden bg-neutral-50 p-8">
        <div className="flex h-full w-1/2 flex-col items-center  justify-center gap-6 rounded-md border border-neutral-200 bg-white px-9 py-8 shadow-xl shadow-neutral-900/10">
          <div className="flex w-4/5 max-w-[625px] flex-col gap-8">
            <h1 className="text-2xl font-bold">
              Get Started with Embedded Data Syncing and Audience Segmenting
            </h1>
            <h2></h2>
            <TokenEntry
              workspaceAccessToken={workspaceAccessToken}
              setWorkspaceAccessToken={setWorkspaceAccessToken}
            />
            <div className="flex flex-row items-stretch gap-3">
              <Button>Sign Up for Census</Button>
              <Button>Talk to Sales</Button>
            </div>
          </div>
        </div>
        <div className="flex w-1/2 flex-col items-center justify-center p-12">
          <div className="flex w-[525px] flex-col gap-4">
            <h1 className="text-xl font-medium leading-snug">
              Your product as the source of truth for your customers
            </h1>
            <p className="text-base leading-normal">
              Welcome! This demo app shows how your customer can use Census Embedded to import data from their
              source to your desination and export data from your destination to their CRM and ad tools.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
