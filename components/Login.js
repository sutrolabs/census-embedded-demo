import { useState } from "react";

export default function Login({ setApiKey }) {
  const [localApiKey, setLocalApiKey] = useState("");

  return (
    <main>
      <form
        className="flex flex-col gap-2"
        onSubmit={() => setApiKey(localApiKey)}
      >
        <div>Please enter your API key</div>
        <input
          className="border border-cyan-300"
          type="password"
          value={localApiKey}
          name="census-api-key"
          autoComplete="off"
          onInput={(event) => setLocalApiKey(event.target.value)}
        />
        <button
          className="border border-gray-400 disabled:bg-gray-200"
          disabled={!localApiKey}
        >
          Set
        </button>
      </form>
    </main>
  );
}
