import { useEffect, useState } from "react"
import { useFetch } from "usehooks-ts"

import Error_ from "@components/Error_"
import Loading from "@components/Loading"
import Setup from "@components/Setup"

export default function TokenEntry({ setPersonalAccessToken }) {
  const [localPersonalAccessToken, setLocalPersonalAccessToken] = useState("")
  const { error, data, startedTest, startTest, stopTest } =
    useTestPersonalAccessToken(localPersonalAccessToken)

  useEffect(() => {
    if (data) {
      setPersonalAccessToken(localPersonalAccessToken)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (error) {
    return (
      <Error_ setup error={error}>
        <button
          autoFocus
          className="rounded-md border border-slate-900 bg-slate-50 px-6 py-2 text-slate-900 shadow-md"
          onClick={() => {
            stopTest()
            setLocalPersonalAccessToken("")
          }}
        >
          Back
        </button>
      </Error_>
    )
  } else if (startedTest) {
    return <Loading setup />
  }

  return (
    <Setup>
      <form
        className="flex flex-col items-center gap-2 rounded-md border border-sky-500 bg-sky-50 px-10 py-8 shadow-md"
        onSubmit={(event) => {
          event.preventDefault()
          startTest()
        }}
      >
        <h2 className="text-center text-xl font-medium text-slate-800">Welcome to the demo!</h2>
        <p className="text-center text-sky-800">
          Enter your Census{" "}
          <a
            className="text-sky-500 underline"
            href="https://developers.getcensus.com/api-reference/introduction/authorization#using-bearer-tokens-with-organization-apis"
          >
            Personal Access Token
          </a>{" "}
          to get started...
        </p>
        <input
          className="my-2 min-w-[420px] rounded-md border border-sky-500 px-4 py-2 font-mono shadow-inner"
          autoFocus
          type="password"
          value={localPersonalAccessToken}
          name="census-personal-access-token"
          autoComplete="off"
          placeholder="csp_..."
          onInput={(event) => setLocalPersonalAccessToken(event.target.value)}
        />
        <button
          className="rounded-md border border-sky-700 bg-sky-600 px-6 py-2 text-lg font-bold text-sky-50 shadow-sm disabled:border-sky-300 disabled:bg-sky-200"
          disabled={!localPersonalAccessToken}
        >
          Continue
        </button>
      </form>
    </Setup>
  )
}

const useTestPersonalAccessToken = (localPersonalAccessToken) => {
  const [startedTest, setStarted] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const { error: fetchError, ...fetchState } = useFetch(
    startedTest ? `/api/test_personal_access_token?attempt=${attempt}` : undefined,
    startedTest
      ? {
          method: "POST",
          headers: {
            ["authorization"]: `Bearer ${localPersonalAccessToken}`,
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
  const error = startedTest ? fetchError : null
  return { ...fetchState, error, startedTest, startTest, stopTest }
}
