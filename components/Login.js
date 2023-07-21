import { useEffect, useState } from "react"
import { useFetch } from "usehooks-ts"

export default function Login({ setApiKey }) {
  const [localApiKey, setLocalApiKey] = useState("")
  const { error, data, startedTest, startTest, stopTest } = useTestApiKey(localApiKey)

  useEffect(() => {
    if (data) {
      setApiKey(localApiKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <main className="col-span-2 grid place-items-center bg-slate-200 p-8">
      {!startedTest ? (
        <form
          className="flex flex-col items-center gap-2 rounded-md border border-sky-500 bg-sky-50 px-10 py-8 shadow-md"
          onSubmit={(event) => {
            event.preventDefault()
            startTest()
          }}
        >
          <h2 className="text-center text-xl font-medium text-slate-800">Welcome to the demo!</h2>
          <p className="text-center text-sky-800">Enter your Census API key to get started...</p>
          <input
            className="my-2 min-w-[420px] rounded-md border border-sky-500 px-4 py-2 shadow-inner"
            type="password"
            value={localApiKey}
            name="census-api-key"
            autoComplete="off"
            placeholder="secret-token:..."
            onInput={(event) => setLocalApiKey(event.target.value)}
          />
          <button
            className="rounded-md border border-sky-700 bg-sky-600 px-6 py-2 text-lg font-bold text-sky-50 shadow-sm disabled:border-sky-300 disabled:bg-sky-200"
            disabled={!localApiKey}
          >
            Log in
          </button>
        </form>
      ) : error ? (
        <form
          className="flex flex-col items-center gap-4 rounded-md border border-red-500 bg-slate-100 px-10 py-8 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault()
            stopTest()
            setLocalApiKey("")
          }}
        >
          <div className="text-lg text-red-700">{`${error}`}</div>
          <button className="rounded-md border border-slate-900 bg-slate-50 px-6 py-2 text-slate-900 shadow-md">
            Back
          </button>
        </form>
      ) : (
        <form className="flex flex-col items-center gap-2 rounded-md border border-sky-500 bg-sky-50 px-10 py-8 shadow-md">
          <div className="text-sky-600">Loading...</div>
        </form>
      )}
    </main>
  )
}

const useTestApiKey = (localApiKey) => {
  const [startedTest, setStarted] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const fetchState = useFetch(
    startedTest ? `/api/test_api_key?attempt=${attempt}` : undefined,
    startedTest
      ? {
          method: "POST",
          headers: {
            ["authorization"]: `Bearer ${localApiKey}`,
          },
        }
      : undefined,
  )
  const startTest = () => {
    setStarted(true)
  }
  const stopTest = () => {
    setStarted(false)
    setAttempt(attempt + 1)
  }
  return { ...fetchState, startedTest, startTest, stopTest }
}
