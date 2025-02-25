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
          <div className="relative flex  max-w-xl flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-neutral-100 bg-white py-16 shadow-md">
            <div className="flex w-4/5 max-w-[650px] flex-col gap-8">
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
                  Acme Marketing demos how to use embedded data syncing and audience segmenting. Get started
                  using a secret token from your workspace.
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
        <div className=" flex h-full w-1/3 max-w-[550px] flex-col items-start gap-3 rounded-l-lg bg-white px-16 py-12">
          <Image src="/census-logo.svg" height={50} width={120} alt="Census Logo" />
          <div className="flex h-full w-full items-center justify-center">
            <div className=" flex w-full flex-col items-start gap-4">
              <h1 className=" text-2xl font-medium leading-snug">
                Your product as the source of truth for your customers
              </h1>
              <p className="text-lg leading-normal">
                The best way to import and export data for your customers. Unlock 200+ integrations, onboard
                users faster, and focus on building your core product. Leave the APIs to us.
              </p>
              <div className="flex flex-row gap-5">
                <Button brand className="mt-4">
                  Sign Up for Census
                </Button>
                <Button brand className="mt-4">
                  Read the Docs
                </Button>
              </div>
            </div>
          </div>
        </div>
        <FlickeringGrid
          className="absolute inset-0 -z-10 w-full [mask-image:radial-gradient(1800px_circle_at_right,transparent,black)]"
          squareSize={2}
          gridGap={8}
          color="#817DFC"
          maxOpacity={0.3}
          flickerChance={0.4}
          height={2500}
          width={2000}
        />
      </div>
    </>
  )
}
