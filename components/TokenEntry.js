import { useEffect, useState } from "react"

import { Anchor } from "@components/Anchor"
import Button from "@components/Button"
import { useBasicFetch } from "@utils/fetch"

export default function TokenEntry({ workspaceAccessToken, setWorkspaceAccessToken }) {
  const [localCensusWorkspaceToken, setLocalCensusWorkspaceToken] = useState(
    process.env["NEXT_PUBLIC_LOCAL_DEVELOPMENT_WORKSPACE_ACCESS_TOKEN"] ?? "",
  )
  const { loading, error, setError, data, setData, refetch } = useBasicFetch(
    () =>
      new Request("/api/test_workspace_access_token", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${localCensusWorkspaceToken}`,
        },
      }),
    { initial: false },
  )
  useEffect(() => {
    if (data?.data?.id) {
      setWorkspaceAccessToken(localCensusWorkspaceToken)
      setData()
    }
  }, [data, setData, setWorkspaceAccessToken, localCensusWorkspaceToken])

  useEffect(() => {
    setError()
  }, [localCensusWorkspaceToken, setError])

  return (
    <form
      className="flex flex-col gap-4 data-[disabled]:opacity-20"
      onSubmit={(event) => {
        event.preventDefault()
        refetch()
      }}
      data-disabled={!!workspaceAccessToken ? "" : null}
    >
      <p>
        Welcome! This demo app shows how your customer can use Census Embedded to import data from their
        source to your desination and export data from your destination to their CRM and ad tools.
      </p>
      <p>
        When you use the API, you&apos;ll need a{" "}
        <Anchor href="https://developers.getcensus.com/api-reference/introduction/authorization#using-bearer-tokens-with-workspace-apis">
          Workspace Access Token
        </Anchor>{" "}
        for authentication, so that&apos;s how we&apos;ll start here:
      </p>
      <input
        className="my-2 w-full max-w-sm self-center rounded-md border border-orange-500 px-4 py-2 font-mono shadow-inner"
        autoFocus
        type="password"
        name="census_api_token"
        autoComplete="off"
        placeholder="secret-token:..."
        value={localCensusWorkspaceToken}
        onInput={(event) => setLocalCensusWorkspaceToken(event.target.value)}
        disabled={!!workspaceAccessToken}
      />
      {!!error && <p className="-mt-5 text-center text-red-700">{`${error}`}</p>}
      {!workspaceAccessToken && (
        <Button
          className="self-center px-6 py-2"
          solid
          disabled={!localCensusWorkspaceToken || !!error || loading}
        >
          Continue
        </Button>
      )}
    </form>
  )
}
