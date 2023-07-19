export default function Header({ apiKey, setApiKey }) {
  return (
    <header className="flex flex-row justify-between">
      <h1 className="text-lg font-bold">Welcome to Census</h1>
      <button
        className="self-center border border-gray-500 disabled:bg-gray-300"
        disabled={!apiKey}
        onClick={() => setApiKey(null)}
      >
        Log out
      </button>
    </header>
  )
}
