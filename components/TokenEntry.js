import { useEffect, useState } from "react"
import { useFetch } from "usehooks-ts"

import { Anchor } from "@components/Anchor"
import Button from "@components/Button"
import Error_ from "@components/Error_"
import Loading from "@components/Loading"
import Setup from "@components/Setup"

export default function TokenEntry({ setPersonalAccessToken }) {
  const [localPersonalAccessToken, setLocalPersonalAccessToken] = useState(
    process.env["NEXT_PUBLIC_LOCAL_DEVELOPMENT_PERSONAL_ACCESS_TOKEN"] ?? "",
  )
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
        <Button
          solid
          autoFocus
          onClick={() => {
            stopTest()
            setLocalPersonalAccessToken("")
          }}
        >
          Back
        </Button>
      </Error_>
    )
  } else if (startedTest) {
    return <Loading setup />
  }

  return (
    <Setup>
      <form
        className="flex flex-col items-center gap-2 rounded-md border border-teal-500 bg-white px-10 py-8 shadow-md"
        onSubmit={(event) => {
          event.preventDefault()
          startTest()
        }}
      >
        <h2 className="text-center text-xl font-medium text-stone-800">Welcome to the demo!</h2>
        <p className="text-center text-teal-800">
          Enter your Census{" "}
          <Anchor href="https://developers.getcensus.com/api-reference/introduction/authorization#using-bearer-tokens-with-organization-apis">
            Personal Access Token
          </Anchor>{" "}
          to get started...
        </p>
        <input
          className="my-2 min-w-[420px] rounded-md border border-teal-500 px-4 py-2 font-mono shadow-inner"
          autoFocus
          type="password"
          value={localPersonalAccessToken}
          name="census-personal-access-token"
          autoComplete="off"
          placeholder="csp_..."
          onInput={(event) => setLocalPersonalAccessToken(event.target.value)}
        />
        <Button className="px-6 py-2 text-lg" solid disabled={!localPersonalAccessToken}>
          Continue
        </Button>
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
