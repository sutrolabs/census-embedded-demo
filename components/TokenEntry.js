import Head from "next/head"
import { useEffect, useState } from "react"

import { Anchor } from "@components/Anchor"
import Button from "@components/Button"
import Error_ from "@components/Error_"
import Loading from "@components/Loading"
import { useBasicFetch } from "@utils/fetch"

export default function TokenEntry({ setPersonalAccessToken }) {
  const [localPersonalAccessToken, setLocalPersonalAccessToken] = useState(
    process.env["NEXT_PUBLIC_LOCAL_DEVELOPMENT_PERSONAL_ACCESS_TOKEN"] ?? "",
  )
  const { loading, error, setError, data, refetch } = useBasicFetch(
    () =>
      new Request("/api/test_personal_access_token", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${localPersonalAccessToken}`,
        },
      }),
    { initial: false },
  )

  useEffect(() => {
    if (data) {
      setPersonalAccessToken(localPersonalAccessToken)
    }
  }, [data, setPersonalAccessToken, localPersonalAccessToken])

  if (error) {
    return (
      <Error_ setup error={error}>
        <Button
          solid
          autoFocus
          onClick={() => {
            setError()
            setLocalPersonalAccessToken("")
          }}
        >
          Back
        </Button>
      </Error_>
    )
  } else if (loading) {
    return <Loading setup />
  }

  return (
    <form
      className="flex flex-col items-center gap-2 rounded-md border-2 border-indigo-500 bg-white px-10 py-8 shadow-md"
      onSubmit={(event) => {
        event.preventDefault()
        refetch()
      }}
    >
      <Head>
        <title>Token Entry - Census Embedded Demo App</title>
      </Head>

      <h2 className="text-center text-xl font-medium text-stone-800">Welcome to the demo!</h2>
      <p className="text-center text-stone-800">
        Enter your Census{" "}
        <Anchor href="https://developers.getcensus.com/api-reference/introduction/authorization#using-bearer-tokens-with-organization-apis">
          Personal Access Token
        </Anchor>{" "}
        to get started...
      </p>
      <input
        className="my-2 min-w-[420px] rounded-md border border-indigo-500 px-4 py-2 font-mono shadow-inner"
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
  )
}
