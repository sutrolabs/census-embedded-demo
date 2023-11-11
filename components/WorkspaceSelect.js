import Head from "next/head"
import { useFetch } from "usehooks-ts"

import Button from "@components/Button"
import { Card } from "@components/Card"
import Error_ from "@components/Error_"
import Loading from "@components/Loading"

export default function WorkspaceSelect({ personalAccessToken, setWorkspaceId, onBack }) {
  const { error: workspacesError, data: workspaces } = useFetch("/api/list_workspaces", {
    method: "GET",
    headers: {
      ["authorization"]: `Bearer ${personalAccessToken}`,
    },
  })

  if (workspacesError) {
    return <Error_ setup error={workspacesError} />
  } else if (!workspaces) {
    return <Loading setup />
  }

  const sortedWorkspaces = [...workspaces].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="flex flex-col gap-4 rounded-md border-2 border-indigo-500 bg-stone-50 px-10 py-8 shadow-md">
      <Head>
        <title>Workspace Select - Census Embedded Demo App</title>
      </Head>
      Pick a workspace:
      <div className="grid grid-cols-2 content-center gap-4 ">
        {sortedWorkspaces.map((workspace) => (
          <Card key={workspace.id} className="flex flex-col gap-2">
            <div className="font-medium">{workspace.name}</div>
            <Button solid onClick={() => setWorkspaceId(workspace.id)}>
              Select
            </Button>
          </Card>
        ))}
      </div>
      <hr className="border-t border-stone-300" />
      <Button onClick={onBack}>Back</Button>
    </div>
  )
}
