import Image from "next/image"

import Button from "@components/Button/Button/Button"
import { useSourceFlow } from "@providers/SourceFlowProvider"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@components/Drawer/Drawer"
import SourceConnectionFlow from "@components/Workflows/NewSourceFlow/SourceConnectionFlow"
import { getLogoForSourceType } from "@hooks/useSourceLogos"

export default function NewSourceDrawer({
  workspaceAccessToken,
  onComplete,
  onCancel,
  existingSourceId,
  sourceConnectLinks = [],
  refetchSourceConnectLinks,
  syncManagementLinks = [],
  refetchSyncManagementLinks,
  syncs = [],
  setSyncs,
  refetchSyncs,
  runsLoading = false,
  runs = [],
  devMode = false,
  embedMode = true,
}) {
  const {
    pageTitle,
    pageActions,
    closeDrawer,
    isDrawerOpen,
    openDrawer,
    STEPS,
    selectedSourceType,
    currentStep,
  } = useSourceFlow()

  const getLogo = () => {
    if (
      currentStep === STEPS.CONNECT_SOURCE ||
      currentStep === STEPS.SELECT_OBJECTS ||
      currentStep === STEPS.REVIEW
    ) {
      if (selectedSourceType) {
        return getLogoForSourceType(selectedSourceType)
      }
    }
    return null
  }

  const logo = getLogo()
  return (
    <Drawer direction="right" dismissible={false} open={isDrawerOpen}>
      <DrawerTrigger asChild>
        <Button onClick={openDrawer}>Add Data</Button>
      </DrawerTrigger>
      <DrawerContent direction="right">
        <DrawerHeader>
          <div className="flex flex-row items-center gap-6">
            {pageActions}
            <div className="flex items-center gap-3">
              {logo && (
                <Image
                  src={logo}
                  alt="Source logo"
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              )}
              <DrawerTitle>{pageTitle}</DrawerTitle>
            </div>
          </div>
          <DrawerClose asChild>
            <Button onClick={closeDrawer}>
              <i className="fa-regular fa-xmark" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <SourceConnectionFlow
          workspaceAccessToken={workspaceAccessToken}
          onComplete={onComplete}
          onCancel={onCancel}
          existingSourceId={existingSourceId}
          sourceConnectLinks={sourceConnectLinks}
          refetchSourceConnectLinks={refetchSourceConnectLinks}
          syncManagementLinks={syncManagementLinks}
          refetchSyncManagementLinks={refetchSyncManagementLinks}
          syncs={syncs}
          setSyncs={setSyncs}
          refetchSyncs={refetchSyncs}
          runsLoading={runsLoading}
          runs={runs}
          devMode={devMode}
          embedMode={embedMode}
        />
      </DrawerContent>
    </Drawer>
  )
}
