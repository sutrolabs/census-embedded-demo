import Head from "next/head"
import Link from "next/link"

import Button from "@components/Button"

export default function ComingSoon() {
  return (
    <>
      <Head>
        <title>Coming Soon - Census Embedded Demo App</title>
      </Head>
      <h2 className="text-2xl font-bold text-slate-700">Coming Soon</h2>
      <hr className="border-t border-slate-400" />
      <p className="italic text-slate-500">Coming soon...</p>
      <Link href="/integrations/crm">
        <Button className="min-w-[300px] self-center" solid>
          Go to dashboard
        </Button>
      </Link>
    </>
  )
}
