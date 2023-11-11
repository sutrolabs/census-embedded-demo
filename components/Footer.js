import Image from "next/image"

import { Anchor } from "@components/Anchor"

export default function Footer() {
  return (
    <footer className="col-span-2 flex flex-row items-center justify-center gap-1 border-t border-stone-400 bg-stone-100 p-2 text-indigo-800">
      <Image width={16} height={16} src="/logo.svg" alt="" />
      <span>
        <span className="font-medium">Census Embedded: </span>
        <Anchor
          className="text-indigo-800 hover:text-indigo-500"
          href="https://github.com/sutrolabs/census-embedded-demo"
        >
          code
        </Anchor>
        {" / "}
        <Anchor
          className="text-indigo-800 hover:text-indigo-500"
          href="https://developers.getcensus.com/embedded/overview"
        >
          docs
        </Anchor>
      </span>
    </footer>
  )
}
