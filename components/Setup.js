import Head from "next/head"
import Image from "next/image"

import Button from "@components/Button"
import { FlickeringGrid } from "@components/Magic/FlickeringGridBackground"
import TokenEntry from "@components/TokenEntry"

export function Setup({ workspaceAccessToken, setWorkspaceAccessToken }) {
  return (
    <>
      <Head>
        <title>API Setup</title>
      </Head>
      <div className="relative z-50 flex h-screen flex-row items-center justify-around overflow-hidden bg-[#fafafa] bg-opacity-[.05] pl-8">
        <div className="flex grow items-center justify-center">
          <div className="relative flex  max-w-xl flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-neutral-100 bg-white px-12 py-16 shadow-md">
            <div className="flex w-4/5 max-w-[625px] flex-col gap-8">
              <div className="flex flex-col gap-3">
                <div className="flex flex-row items-center gap-3">
                  <Image
                    src="/acme-demo-logo-square.jpg"
                    width={40}
                    height={40}
                    alt=""
                    className="rounded-xl"
                  />
                  <span className="text-lg font-medium text-neutral-600">Acme Marketing</span>
                </div>
                <h1 className="text-2xl font-bold">Explore Census Embedded</h1>
                <h2 className="text-xl font-normal text-neutral-500">
                  Acme Marketing demos how to use embedded data syncing and audience segmenting
                </h2>
              </div>
              <TokenEntry
                workspaceAccessToken={workspaceAccessToken}
                setWorkspaceAccessToken={setWorkspaceAccessToken}
              />
            </div>
            <div className="bg-brand-development absolute inset-x-0 bottom-0 h-1/5 w-full" />
          </div>
        </div>
        <div className="flex h-full w-1/3 flex-col items-start justify-center gap-3 rounded-lg border border-neutral-300 bg-white p-12">
          <Image src="/census-logo.svg" height={50} width={120} alt="" />
          <h1 className="text-lg font-medium leading-snug">
            Your product as the source of truth for your customers
          </h1>
          <p className="text-lg leading-normal">
            Welcome! This demo app shows how your customer can use Census Embedded to import data from their
            source to your desination and export data from your destination to their CRM and ad tools.
          </p>
          <div className="flex flex-row items-stretch gap-3">
            <Button brand>Sign Up for Census</Button>
          </div>
        </div>
        <FlickeringGrid
          className="absolute inset-0 -z-10 w-full [mask-image:radial-gradient(1800px_circle_at_right,transparent,black)]"
          squareSize={2.5}
          gridGap={8}
          color="#4640EB"
          maxOpacity={0.4}
          flickerChance={0.4}
          height={2500}
          width={2000}
        />
      </div>
    </>
  )
}
