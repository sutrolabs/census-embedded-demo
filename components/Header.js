import Link from "next/link"

export default function Header({ apiKey, setApiKey }) {
  return (
    <header className="col-span-2 flex flex-row justify-between border-b-2 border-slate-700 bg-sky-100 px-6 py-4">
      <h1 className="text-4xl font-bold">
        <Link href="/">Market Data Inc.</Link>
      </h1>
      <button
        className="self-center rounded-md border border-sky-600 bg-slate-50 px-3 py-1 text-sky-600 disabled:border-slate-300 disabled:text-slate-300"
        disabled={!apiKey}
        onClick={() => setApiKey(null)}
      >
        Log out
      </button>
    </header>
  )
}
