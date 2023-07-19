export default function Header({ apiKey, setApiKey }) {
  return (
    <header className="flex flex-row">
      <h1 className="text-lg font-bold">Welcome to Census</h1>
      {apiKey ? (
        <button onClick={() => setApiKey(null)}>Clear API key</button>
      ) : null}
    </header>
  );
}
