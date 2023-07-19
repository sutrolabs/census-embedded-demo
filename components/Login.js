import { useEffect, useState } from "react";
import { useFetch } from "usehooks-ts";

export default function Login({ setApiKey }) {
  const [localApiKey, setLocalApiKey] = useState("");
  const { error, data, startedTest, startTest, stopTest } =
    useTestApiKey(localApiKey);

  useEffect(() => {
    let cancel = false;
    (async () => {
      if (data) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!cancel) {
          setApiKey(localApiKey);
        }
      }
    })();
    return () => {
      cancel = true;
    };
  }, [data, localApiKey]);

  return (
    <main>
      {!startedTest ? (
        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            startTest();
          }}
        >
          <div>Please enter your API key</div>
          <input
            className="border border-cyan-300"
            type="password"
            value={localApiKey}
            name="census-api-key"
            autoComplete="off"
            placeholder="secret-token:..."
            onInput={(event) => setLocalApiKey(event.target.value)}
          />
          <button
            className="border border-gray-400 disabled:bg-gray-200"
            disabled={!localApiKey}
          >
            Log in
          </button>
        </form>
      ) : error ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            stopTest();
            setLocalApiKey("");
          }}
        >
          <div>{`${error}`}</div>
          <button
            className="border border-gray-400 disabled:bg-gray-200"
            disabled={!localApiKey}
          >
            Try again
          </button>
        </form>
      ) : (
        "DONE"
      )}
    </main>
  );
}

const useTestApiKey = (localApiKey) => {
  const [startedTest, setStarted] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const fetchState = useFetch(
    startedTest ? `/api/test-api-key?attempt=${attempt}` : undefined,
    startedTest
      ? {
          method: "post",
          headers: {
            ["authorization"]: `Bearer ${localApiKey}`,
          },
        }
      : undefined
  );
  const startTest = () => {
    setStarted(true);
  };
  const stopTest = () => {
    setStarted(false);
    setAttempt(attempt + 1);
  };
  return { ...fetchState, startedTest, startTest, stopTest };
};
