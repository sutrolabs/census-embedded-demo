import { useEffect, useState } from "react"

import { Anchor } from "@components/Anchor"
import Button from "@components/Button"
import { useBasicFetch } from "@utils/fetch"
import Link from "next/link"

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
      className="flex flex-col data-[disabled]:opacity-20"
      onSubmit={(event) => {
        event.preventDefault()
        refetch()
      }}
      data-disabled={!!workspaceAccessToken ? "" : null}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-medium leading-none">Secret Token</label>

          <input
            className="w-full rounded-md border border-neutral-200 px-3 py-2"
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
          <span className="text-sm">
            Copy your secret token from your workspace settings to preview the Census Embedded Demo App.{" "}
            <Link href="https://developers.getcensus.com/api-reference/introduction/authorization#using-bearer-tokens-with-workspace-apis">
              {" "}
              Learn More
            </Link>
          </span>
        </div>
        {!workspaceAccessToken && (
          <Button solid disabled={!localCensusWorkspaceToken || !!error || loading}>
            Continue
          </Button>
        )}
      </div>
    </form>
  )
}
