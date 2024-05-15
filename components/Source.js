import { Dialog } from "@headlessui/react"
import { useState } from "react"

import Button from "@components/Button"
import { Card } from "@components/Card"
import EmbeddedFrame from "@components/EmbeddedFrame"
import Toggle from "@components/Toggle"
import { useSourceConnectLink } from "@hooks/use-source-connect-link"
import { useSyncManagementLink } from "@hooks/use-sync-management-link"

export default function Source({
  label,
  type,
  iconClassName,
  workspaceAccessToken,
  sources,
  setSources,
  sourceConnectLinks,
  embedSourceFlow,
  syncManagementLinks,
}) {
  const [loading, setLoading] = useState(false)
  const [disabledOverride, setDisabledOverride] = useState()
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const source = sources.find((item) => item.type === type)
  const disabled = disabledOverride ?? !source

  const [sourceConnectLink, getNewSourceConnectLink, isSourceConnectLinkLoading] = useSourceConnectLink(
    sourceConnectLinks,
    type,
    workspaceAccessToken,
  )
  const [syncManagementLink, resetSyncManagementLink, isSyncManagementLinkLoading] = useSyncManagementLink(
    syncManagementLinks,
    workspaceAccessToken,
  )
  const [showEmbeddedFrame, setShowEmbeddedFrame] = useState(!!source)

  const initiateSourceConnectFlow = (sourceConnectLinkData) => {
    if (embedSourceFlow) {
      setShowEmbeddedFrame(true)
    } else {
      window.location.href = sourceConnectLinkData.uri
    }
  }

  const onExitedConnectionFlow = async (connectionDetails) => {
    setShowEmbeddedFrame(false)
    setLoading(false)
    if (connectionDetails.status === "created") {
      setDisabledOverride(false)
    } else {
      // Status is "not_created"
      setDisabledOverride()
    }
  }

  const deleteSource = async (source) => {
    const response = await fetch("/api/delete_source", {
      method: "DELETE",
      headers: {
        ["authorization"]: `Bearer ${workspaceAccessToken}`,
        ["content-type"]: "application/json",
      },
      body: JSON.stringify({
        id: source.id,
      }),
    })
    if (!response.ok) {
      throw new Error(response.statusText)
    }
  }

  const isLoading = isSourceConnectLinkLoading || isSyncManagementLinkLoading
  const SyncCreationStep = () => {
    if (!showEmbeddedFrame) return null

    return !source ? (
      <EmbeddedFrame connectLink={sourceConnectLink.uri} onExit={onExitedConnectionFlow} />
    ) : (
      <>
        <p className="mb-4 text-teal-400">Step 2: Choose which source objects to sync</p>
        <EmbeddedFrame
          connectLink={
            syncManagementLink.uri + "&form_connection_id=" + source.id + "&form_source_type=warehouse"
          }
          onExit={() => null}
        />
      </>
    )
  }

  return (
    <Card className="flex flex-col gap-4" disabled={disabled}>
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => {
          setLoading(false)
          setDisabledOverride()
          setIsDeleteConfirmOpen(false)
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Dialog.Panel className="flex w-full max-w-md flex-col gap-4 rounded bg-stone-100 px-8 py-6">
            <Dialog.Title className="text-xl font-bold text-stone-700">Delete source</Dialog.Title>
            <Dialog.Description className="text-stone-600">
              This will permanently remove your connection to {label}.
            </Dialog.Description>

            <p className="text-stone-600">Are you sure you want to continue?</p>

            <div className="flex flex-row justify-end gap-3">
              <Button
                solid
                disabled={loading}
                onClick={async () => {
                  try {
                    setLoading(true)
                    await deleteSource(source)
                    setShowEmbeddedFrame(false)
                    resetSyncManagementLink()
                    setSources(sources.filter((item) => item.id !== source.id))
                  } finally {
                    setLoading(false)
                    setDisabledOverride()
                    setIsDeleteConfirmOpen(false)
                  }
                }}
              >
                Delete
              </Button>
              <Button
                disabled={loading}
                onClick={() => {
                  setLoading(false)
                  setDisabledOverride()
                  setIsDeleteConfirmOpen(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <h3 className="flex flex-row justify-between">
        <span
          className="flex flex-row items-center gap-2 text-lg font-medium text-stone-500 data-[enabled]:text-teal-900"
          data-enabled={source ? "" : null}
        >
          <i className={iconClassName} />
          {label}
        </span>
        <Toggle
          checked={!disabled}
          disabled={loading || isDeleteConfirmOpen}
          onChange={async () => {
            if (source) {
              // Delete the source
              setDisabledOverride(true)
              setIsDeleteConfirmOpen(true)
            } else if (sourceConnectLink) {
              // Create a source: We already have a source connect link
              setLoading(true)
              setDisabledOverride(false)
              initiateSourceConnectFlow(sourceConnectLink)
            } else {
              // Create a source:We need to create a source connect link
              try {
                setLoading(true)
                setDisabledOverride(false)
                const newLink = await getNewSourceConnectLink()
                initiateSourceConnectFlow(newLink)
              } catch (error) {
                setLoading(false)
                setDisabledOverride()
                throw error
              }
            }
          }}
        />
      </h3>
      {!isLoading && <SyncCreationStep />}
    </Card>
  )
}
