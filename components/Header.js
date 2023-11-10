import Link from "next/link"

export default function Header({ loggedIn, onLogOut }) {
  return (
    <header className="col-span-2 flex flex-row items-end gap-4 border-b-2 border-slate-700 bg-sky-100 px-6 py-4">
      <h1 className="text-4xl font-bold">
        <Link href="/">Market Data Inc.</Link>
      </h1>
      <input
        className="ml-4 grow rounded-md border border-slate-300 bg-slate-50 px-3 py-1 shadow-inner disabled:invisible"
        type="search"
        autoComplete="off"
        placeholder="Search..."
        disabled={!loggedIn}
      />
      <button
        className="rounded-md border border-sky-600 bg-slate-50 px-3 py-1 text-sky-600 shadow-sm disabled:border-slate-300 disabled:text-slate-300"
        disabled={!loggedIn}
        onClick={onLogOut}
      >
        Log out
      </button>
    </header>
  )
}
