import { Anchor } from "@components/Anchor"

export default function Footer() {
  return (
    <footer className="items-center flex flex-row justify-center col-span-2 border-t border-stone-400 gap-1 bg-stone-100 p-2 text-indigo-800">
      <img width={16} src="/logo.svg" />
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
