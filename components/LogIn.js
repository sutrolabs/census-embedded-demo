import Head from "next/head"

import { Anchor } from "@components/Anchor"
import Button from "@components/Button"
import SetupLayout from "@components/SetupLayout"

export default function LogIn({ onLogIn }) {
  return (
    <SetupLayout>
      <Head>
        <title>Log In - Census Embedded Demo App</title>
      </Head>

      <div className="flex max-w-xl flex-col items-stretch gap-4 rounded-md bg-stone-50 px-12 py-10 shadow-lg">
        <h1 className="flex flex-row items-center justify-center gap-3">
          <i class="fa-solid fa-mug-tea text-4xl text-teal-600" />
          <div className="text-3xl font-bold  text-teal-700">Tea Research International</div>
        </h1>
        <div className="mt-2 text-center text-lg text-teal-700">
          Log in to access your personalized tea distribution market intelligence workspace
        </div>
        <input
          className="mx-8 my-2 min-w-[420px] rounded-md border border-teal-500 px-4 py-2 text-lg shadow-inner"
          defaultValue="owner@teaproducer.com"
        />
        <Button className="mx-8 px-6 py-2 text-xl" solid onClick={onLogIn}>
          Log in
        </Button>
        <div className="text-center text-sm text-teal-700">
          Don&apos;t have an account? <Anchor href="/">Sign up</Anchor> now
        </div>
      </div>
    </SetupLayout>
  )
}
