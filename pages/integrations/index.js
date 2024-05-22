import Head from "next/head"
import Link from "next/link"

import { Anchor } from "@components/Anchor"
import Button from "@components/Button"

export default function Index() {
  return (
    <>
      <Head>
        <title>Integrations - Census Embedded Demo App</title>
      </Head>
      <h2 className="text-2xl font-bold text-stone-700">Integrations</h2>
      <hr className="border-t border-stone-400" />
      <h3 className="text-xl font-bold text-stone-700">Export</h3>
      <p className="italic text-stone-500">
        Activate your data by <Anchor href="https://www.getcensus.com">syncing</Anchor> it to the tools you
        use every day. It&apos;s time to bring your revenue to the next level!
      </p>
      <Link href="/integrations/export-crm">
        <Button className="min-w-[300px] self-center" solid>
          Connect your CRM
          <i className="fa-solid fa-chevron-right ml-2" />
        </Button>
      </Link>
      <Link href="/integrations/export-ads">
        <Button className="min-w-[300px] self-center" solid>
          Connect your ad platforms
          <i className="fa-solid fa-chevron-right ml-2" />
        </Button>
      </Link>
      <h3 className="text-xl font-bold text-stone-700">Import</h3>
      <p className="italic text-stone-500">
        Enrich your data in Marketing Magnet by <Anchor href="https://www.getcensus.com">syncing</Anchor> it
        from your data warehouse. Enhance your Marketing Research today!
      </p>
      <Link href="/integrations/import-dataset">
        <Button className="min-w-[300px] self-center" solid>
          Import data to Marketing Magnet
          <i className="fa-solid fa-chevron-right ml-2" />
        </Button>
      </Link>
    </>
  )
}
