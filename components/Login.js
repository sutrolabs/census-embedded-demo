import { useEffect, useState } from "react"
import { useFetch } from "usehooks-ts"

export default function Login({ setApiKey }) {
  const [localApiKey, setLocalApiKey] = useState("")
  const { error, data, startedTest, startTest, stopTest } = useTestApiKey(localApiKey)

  useEffect(() => {
    let cancel = false
    ;(async () => {
      if (data) {
        await new Promise((resolve) => setTimeout(resolve, 200))

        if (!cancel) {
          setApiKey(localApiKey)
        }
      }
    })()
    return () => {
      cancel = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <main className="col-span-2 bg-slate-200 p-8">
      {!startedTest ? (
        <form
          className="flex flex-col items-center gap-4 rounded-sm border border-sky-500 bg-sky-50 p-8 shadow-md"
          onSubmit={(event) => {
            event.preventDefault()
            startTest()
          }}
        >
          <h2 className="text-center text-xl font-medium">Enter your Census API key to continue</h2>
          <input
            className="min-w-[420px] rounded-md border border-sky-700 px-4 py-2 text-lg"
            type="password"
            value={localApiKey}
            name="census-api-key"
            autoComplete="off"
            placeholder="secret-token:..."
            onInput={(event) => setLocalApiKey(event.target.value)}
          />
          <button
            className="rounded-md border border-sky-700 bg-sky-600 px-6 py-2 text-xl font-bold text-sky-50 disabled:border-sky-200 disabled:bg-sky-200"
            disabled={!localApiKey}
          >
            Log in
          </button>
        </form>
      ) : error ? (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            stopTest()
            setLocalApiKey("")
          }}
        >
          <div>{`${error}`}</div>
          <button className="border border-gray-400 disabled:bg-gray-200" disabled={!localApiKey}>
            Try again
          </button>
        </form>
      ) : (
        "DONE"
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
