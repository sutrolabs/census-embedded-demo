import { useCallback, useState, useEffect } from "react"

import Button from "@components/Button/Button/Button"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader } from "@components/Drawer/Drawer"
import EmbeddedFrame from "@components/EmbeddedFrame/EmbeddedFrame"

export function SyncManagementDrawer({
  isOpen,
  onClose,
  workspaceAccessToken,
  presetSource,
  presetDestination,
  existingSyncId,
  onSyncComplete,
}) {
  const [connectLink, setConnectLink] = useState(null)

  useEffect(() => {
    if (isOpen) {
      generateSyncManagementUrl().then((url) => {
        setConnectLink(url)
      })
    } else {
      setConnectLink(null)
    }
  }, [isOpen, workspaceAccessToken, presetSource, presetDestination, existingSyncId])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const generateSyncManagementUrl = async () => {
    const response = await fetch("/api/create_sync_management_link", {
      method: "POST",
      headers: {
        ["authorization"]: `Bearer ${workspaceAccessToken}`,
        ["content-type"]: "application/json",
      },
    })

    const params = new URLSearchParams({})

    if (presetSource) {
      params.append("source_connection_id", presetSource.id)
      params.append("source_hidden", "true")
    }

    if (presetDestination) {
      params.append("destination_connection_id", presetDestination.id)
      params.append("destination_hidden", "true")
    }

    if (existingSyncId) {
      params.append("sync_id", existingSyncId)
    }

    const newLink = await response.json()

    console.log(newLink)

    const result = `${newLink.uri}&${params.toString()}`

    console.log(result)
    return result
  }

  const handleExit = useCallback(
    (data) => {
      if (data.status === "created" || data.status === "updated") {
        onSyncComplete?.(data.details)
      }
      handleClose()
    },
    [handleClose, onSyncComplete],
  )

  return (
    <Drawer open={isOpen} onClose={onClose} direction="right">
      <DrawerContent direction="right">
        <DrawerHeader>
          {existingSyncId ? "Edit Sync" : "Create Sync"}
          <DrawerClose>
            <Button>
              <i className="fa-regular fa-times" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        {connectLink && (
          <EmbeddedFrame connectLink={connectLink} onExit={handleExit} height="100%" className="w-full" />
        )}
      </DrawerContent>
    </Drawer>
  )
}
