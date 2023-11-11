import Link from "next/link"

import Button from "@components/Button"

export default function Header({ loggedIn, onLogOut }) {
  if (!loggedIn) {
    return <header className="invisible" />
  }
  return (
    <header className="col-span-2 flex flex-row items-center gap-4 border-b border-stone-400 bg-stone-100 px-6 py-4">
      <h1 className="grow lg:grow-0">
        <Link href="/">
          <a className="flex flex-row items-center gap-4">
            <i className="fa-solid fa-mug-tea text-2xl text-teal-600 sm:text-4xl" />
            <div className="flex flex-col">
              <div className="text-lg font-bold text-teal-900  sm:text-2xl">Tea Research International</div>
              <div className="hidden text-sm italic text-stone-700 sm:block">
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
        className="ml-4 hidden grow rounded-md border border-stone-300 bg-stone-50 px-3 py-1 shadow-inner disabled:invisible lg:block"
        type="search"
        autoComplete="off"
        placeholder="Search..."
      />
      {loggedIn ? <span className="hidden text-stone-500 md:inline">owner@teaproducer.com</span> : null}
      <Button onClick={onLogOut}>
        Log out
        <i className="fa-solid fa-right-from-bracket ml-2" />
      </Button>
    </header>
  )
}
