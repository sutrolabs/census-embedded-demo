export default function Header({ apiKey, setApiKey }) {
  return (
    <header className="flex flex-row">
      <h1 className="text-lg font-bold">Welcome to Census</h1>
      <button disabled={!apiKey} onClick={() => setApiKey(null)}>
        Log out
      </button>
    </header>
  );
}
