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
  presetSync,
  onSyncComplete,
}) {
  const [connectLink, setConnectLink] = useState(null)

  const generateSyncManagementUrl = useCallback(async () => {
    const response = await fetch("/api/create_sync_management_link", {
      method: "POST",
      headers: {
        ["authorization"]: `Bearer ${workspaceAccessToken}`,
        ["content-type"]: "application/json",
      },
    })

    const params = new URLSearchParams({})

    if (presetSource) {
      params.append("source_id", presetSource.source_id)
      params.append("bookmarkSegmentId", presetSource.segment_id)
      params.append("source_hidden", "true")
    }

    if (presetDestination) {
      params.append("destination_connection_id", presetDestination.id)
    }

    const newLink = await response.json()
    const result = `${newLink.uri}&${params.toString()}`
    return result
  }, [workspaceAccessToken, presetSource, presetDestination])

  const generateEditSyncManagementUrl = useCallback(async () => {
    const response = await fetch("/api/create_edit_sync_management_link", {
      method: "POST",
      headers: {
        ["authorization"]: `Bearer ${workspaceAccessToken}`,
        ["content-type"]: "application/json",
      },
      body: JSON.stringify({
        syncId: presetSync.id,
      }),
    })
    const newLink = await response.json()
    return newLink.uri
  }, [workspaceAccessToken, presetSync])

  useEffect(() => {
    if (isOpen && !presetSync) {
      generateSyncManagementUrl().then((url) => {
        setConnectLink(url)
      })
    } else if (isOpen && presetSync) {
      generateEditSyncManagementUrl().then((url) => {
        setConnectLink(url)
      })
    } else {
      setConnectLink(null)
    }
  }, [isOpen, generateSyncManagementUrl, generateEditSyncManagementUrl, presetSync])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

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
        <DrawerHeader className="capitalize">
          {presetSync
            ? `Edit Sync to ${presetDestination.name} ${presetSync.destination_attributes.object}`
            : `New Sync to ${presetDestination?.name}`}
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
