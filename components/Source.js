import { Dialog } from "@headlessui/react"
import { useState } from "react"

import Button from "@components/Button"
import { Card } from "@components/Card"
import EmbeddedSourceConnect from "@components/EmbeddedSourceConnect"
import Toggle from "@components/Toggle"

export default function Source({
  label,
  type,
  iconClassName,
  personalAccessToken,
  workspaceId,
  sources,
  setSources,
  sourceConnectLinks,
  embedSourceFlow,
}) {
  const [now] = useState(() => new Date())
  const [loading, setLoading] = useState(false)
  const [disabledOverride, setDisabledOverride] = useState()
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  const [sourceConnectLink, setSourceConnectLink] = useState(
    sourceConnectLinks.find(
      (item) => item.type === type && new Date(item.expiration) > now && !item.revoked && !item.source_id,
    ),
  )
  const [showEmbeddedConnectLink, setShowEmbeddedConnectLink] = useState(false)

  const initiateSourceConnectFlow = (sourceConnectLinkData) => {
    if (embedSourceFlow) {
      setShowEmbeddedConnectLink(true)
    } else {
      window.location.href = sourceConnectLinkData.uri
    }
  }

  const source = sources.find((item) => item.type === type)
  const disabled = disabledOverride ?? !source

  const exitedConnectionFlow = async (connectionDetails) => {
    setShowEmbeddedConnectLink(false)
    setLoading(false)
    if (connectionDetails.status === "created") {
      setDisabledOverride(false)
    } else {
      // Status is "not_created"
      setDisabledOverride()
    }
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
                    const response = await fetch("/api/delete_source", {
                      method: "DELETE",
                      headers: {
                        ["authorization"]: `Bearer ${personalAccessToken}`,
                        ["content-type"]: "application/json",
                      },
                      body: JSON.stringify({
                        workspaceId,
                        id: source.id,
                      }),
                    })
                    if (!response.ok) {
                      throw new Error(response.statusText)
                    }
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
              setDisabledOverride(true)
              setIsDeleteConfirmOpen(true)
            } else if (sourceConnectLink) {
              setLoading(true)
              setDisabledOverride(false)
              initiateSourceConnectFlow(sourceConnectLink)
            } else {
              try {
                setLoading(true)
                setDisabledOverride(false)
                const response = await fetch("/api/create_source_connect_link", {
                  method: "POST",
                  headers: {
                    ["authorization"]: `Bearer ${personalAccessToken}`,
                    ["content-type"]: "application/json",
                  },
                  body: JSON.stringify({
                    workspaceId,
                    type,
                  }),
                })
                if (!response.ok) {
                  throw new Error(response.statusText)
                }
                const data = await response.json()
                setSourceConnectLink(data)
                initiateSourceConnectFlow(data)
              } catch (error) {
                setLoading(false)
                setDisabledOverride()
                throw error
              }
            }
          }}
        />
      </h3>
      {showEmbeddedConnectLink && (
        <EmbeddedSourceConnect
          connectLink={sourceConnectLink.uri.replace("https://", "http://")}
          exitedConnectionFlow={exitedConnectionFlow}
        />
      )}
    </Card>
  )
}
