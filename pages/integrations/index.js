import Link from "next/link"

import { Anchor } from "@components/Anchor"
import Button from "@components/Button"
import Header from "@components/Structural/Header/Header"

export default function Index() {
  return (
    <>
      <Header title="Integrations" />
      <div className="flex h-full flex-col gap-8 px-8 py-6">
        <h3 className="text-xl font-bold text-neutral-700">Export</h3>
        <p className="italic text-neutral-500">
          Activate your data by <Anchor href="https://www.getcensus.com">syncing</Anchor> it to the tools you
          use every day. It&apos;s time to bring your revenue to the next level!
        </p>

        <Button className="min-w-[300px] self-center" solid>
          Connect your CRM
          <i className="fa-solid fa-chevron-right ml-2" />
        </Button>

        <Button className="min-w-[300px] self-center" solid>
          Connect your ad platforms
          <i className="fa-solid fa-chevron-right ml-2" />
        </Button>
      </div>
    </>
  )
}
