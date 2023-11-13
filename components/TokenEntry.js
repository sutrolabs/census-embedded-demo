import { useEffect, useState } from "react"

import { Anchor } from "@components/Anchor"
import Button from "@components/Button"
import { useBasicFetch } from "@utils/fetch"

export default function TokenEntry({ personalAccessToken, setPersonalAccessToken }) {
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

  useEffect(() => {
    setError()
  }, [localPersonalAccessToken, setError])

  return (
    <form
      className="flex flex-col gap-4 data-[disabled]:opacity-20"
      onSubmit={(event) => {
        event.preventDefault()
        refetch()
      }}
      data-disabled={!!personalAccessToken ? "" : null}
    >
      <p>
        Welcome! This demo app shows how to activate data in a customer&apos;s CRM and ad tools using Census
        Embedded.
      </p>
      <p>
        When you use the API, you&apos;ll need a{" "}
        <Anchor href="https://developers.getcensus.com/api-reference/introduction/authorization#using-bearer-tokens-with-organization-apis">
          Personal Access Token
        </Anchor>{" "}
        for authentication, so that&apos;s how we&apos;ll start here:
      </p>
      <input
        className="my-2 w-full max-w-sm self-center rounded-md border border-indigo-500 px-4 py-2 font-mono shadow-inner"
        autoFocus
        type="password"
        value={localPersonalAccessToken}
        name="census-personal-access-token"
        autoComplete="off"
        placeholder="csp_..."
        onInput={(event) => setLocalPersonalAccessToken(event.target.value)}
        disabled={!!personalAccessToken}
      />
      {!!error && <p className="-mt-5 text-center text-red-700">{`${error}`}</p>}
      {!personalAccessToken && (
        <Button
          className="self-center px-6 py-2"
          solid
          disabled={!localPersonalAccessToken || !!error || loading}
        >
          Continue
        </Button>
      )}
    </form>
  )
}
