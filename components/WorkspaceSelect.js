import { useFetch } from "usehooks-ts"

import Error_ from "@components/Error_"
import Loading from "@components/Loading"
import Setup from "@components/Setup"

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
    <Setup>
      <div className="flex flex-col gap-4 rounded-md border border-sky-500 bg-sky-50 px-10 py-8 shadow-md">
        Pick a workspace:
        <div className="grid grid-cols-2 content-center gap-4 ">
          {sortedWorkspaces.map((workspace) => (
            <div
              className="flex flex-col gap-2 rounded-md border border-sky-300  bg-slate-50 px-4 py-3 shadow-sm data-[destination]:border-sky-300"
              key={workspace.id}
            >
              <div className="font-medium">{workspace.name}</div>
              <button
                className="rounded-md border border-sky-600 bg-sky-50 px-3 py-1 text-sky-600 shadow-sm"
                onClick={() => setWorkspaceId(workspace.id)}
              >
                Select
              </button>
            </div>
          ))}
        </div>
        <hr className="border-t border-slate-300" />
        <button
          className="self-start rounded-md border border-sky-600 bg-sky-50 px-3 py-1 text-sky-600 shadow-sm"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </Setup>
  )
}
