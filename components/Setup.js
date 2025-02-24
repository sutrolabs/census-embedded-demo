import Head from "next/head"

import Button from "@components/Button"
import TokenEntry from "@components/TokenEntry"

export function Setup({ workspaceAccessToken, setWorkspaceAccessToken }) {
  return (
    <>
      <Head>
        <title>API Setup</title>
      </Head>
      <div className="relative z-50 flex h-screen flex-row overflow-hidden  bg-[#fafafa] bg-opacity-[.05] p-8">
        <div className="relative flex h-full w-1/2 flex-col  items-center justify-center gap-6 overflow-hidden rounded-md border border-neutral-100 bg-white px-9 py-8 shadow-md">
          <div className="flex w-4/5 max-w-[625px] flex-col gap-4">
            <h1 className="text-2xl font-bold">
              Explore how to use Embedded Data Syncing and Audience Segmenting
            </h1>
            <TokenEntry
              workspaceAccessToken={workspaceAccessToken}
              setWorkspaceAccessToken={setWorkspaceAccessToken}
            />
          </div>
          <div className="bg-brand-development absolute inset-x-0 bottom-0 h-1/5 w-full" />
        </div>
        <div className="flex w-1/2 flex-col items-center justify-center p-12">
          <div className="relative flex flex-col gap-4 overflow-hidden">
            <h1 className="text-xl font-medium leading-snug">
              Your product as the source of truth for your customers
            </h1>
            <p className="text-base leading-normal">
              Welcome! This demo app shows how your customer can use Census Embedded to import data from their
              source to your desination and export data from your destination to their CRM and ad tools.
            </p>
            <div className="flex flex-row items-stretch gap-3">
              <Button brand>Sign Up for Census</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
