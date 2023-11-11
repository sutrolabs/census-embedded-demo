import Link from "next/link"

import Button from "@components/Button"

export default function Header({ loggedIn, onLogOut }) {
  if (!loggedIn) {
    return <header className="invisible" />
  }
  return (
    <header className="col-span-2 flex flex-row items-center gap-4 border-b border-stone-400 bg-stone-100 px-6 py-4">
      <h1>
        <Link href="/">
          <a className="flex flex-row items-center gap-4 text-4xl">
            <i class="fa-solid fa-mug-tea text-4xl text-teal-600" />
            <div class="flex flex-col">
              <div className="text-2xl font-bold  text-teal-900">Tea Research International</div>
              <div className="text-sm italic text-stone-700">
                Superpowering tea producers since{" "}
                <abbr title="Did you know? Iced tea was reportedly first popularized at the 1904 World's Fair">
                  1904
                </abbr>
              </div>
            </div>
          </a>
        </Link>
      </h1>
      <input
        className="ml-4 grow rounded-md border border-stone-300 bg-stone-50 px-3 py-1 shadow-inner disabled:invisible"
        type="search"
        autoComplete="off"
        placeholder="Search..."
      />
      <Button onClick={onLogOut}>Log out</Button>
    </header>
  )
}
