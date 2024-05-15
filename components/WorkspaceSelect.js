import Button from "@components/Button"
import { Card } from "@components/Card"
import { useBasicFetch } from "@utils/fetch"

export default function WorkspaceSelect({ workspaceAccessToken, setWorkspaceId, onBack }) {
  if (!workspaceAccessToken) {
    return (
      <p className="opacity-20">Select a Census workspace to use for sources, destinations, and syncs.</p>
    )
  } else {
    return <Ready workspaceAccessToken={workspaceAccessToken} setWorkspaceId={setWorkspaceId} onBack={onBack} />
  }
}

function Ready({ workspaceAccessToken, setWorkspaceId, onBack }) {
  const { error: workspacesError, data: workspaces } = useBasicFetch(
    () =>
      new Request("/api/list_workspaces", {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
        },
      }),
  )

  if (workspacesError) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-red-700">(Workspaces) {`${workspacesError}`}</p>
        <Button className="self-center" onClick={onBack}>
          Go back
        </Button>
      </div>
    )
  } else if (!workspaces) {
    return <p className="opacity-20">Loading workspaces...</p>
  }

  const sortedWorkspaces = [...workspaces].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="flex flex-col gap-4">
      <Button className="self-center" onClick={onBack}>
        Go back
      </Button>
      <p>Great! You’ve entered a valid personal access token.</p>
      <p>Next pick the Census workspace you’d like to use for sources, destinations, and syncs:</p>
      <div className="flex flex-col items-center gap-4">
        {sortedWorkspaces.map((workspace) => (
          <Card
            key={workspace.id}
            className="flex w-full max-w-sm flex-row items-center justify-between gap-2"
          >
            <div className="font-medium">{workspace.name}</div>
            <Button solid onClick={() => setWorkspaceId(workspace.id)}>
              Select
            </Button>
          </Card>
        ))}
      </div>
      <hr className="border-t border-stone-300" />
    </div>
  )
}
