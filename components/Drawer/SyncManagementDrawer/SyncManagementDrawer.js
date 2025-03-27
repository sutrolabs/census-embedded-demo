import { useCallback, useState } from "react"

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
  const [currentStep, setCurrentStep] = useState("source") // source, destination, configure, review
  const [isSyncDrawerOpen, setIsSyncDrawerOpen] = useState(false)

  const handleClose = useCallback(() => {
    setCurrentStep("source")
    onClose()
  }, [onClose])

  const generateSyncManagementUrl = useCallback(() => {
    const params = new URLSearchParams({
      auth: workspaceAccessToken,
    })

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

    return `${process.env.NEXT_PUBLIC_CENSUS_APP_URL}/sync?${params.toString()}`
  }, [workspaceAccessToken, presetSource, presetDestination, existingSyncId])

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
    <Drawer
      open={isOpen}
      onClose={onClose}
      direction="right"
      title={existingSyncId ? "Edit Sync" : "Create Sync"}
    >
      <DrawerContent direction="right">
        <DrawerHeader>
          Sync{" "}
          <DrawerClose>
            <Button>
              <i className="fa-regular fa-times" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <EmbeddedFrame connectLink={generateSyncManagementUrl()} onExit={handleExit} height="100%" />
      </DrawerContent>
    </Drawer>
  )
}
