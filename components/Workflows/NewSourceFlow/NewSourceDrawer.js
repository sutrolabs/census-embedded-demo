import Image from "next/image"

import Button from "@components/Button"
import { useSourceFlow } from "@components/Contexts/SourceFlowContext"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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
    goBack,
    STEPS,
    selectedSourceType,
    selectedSource,
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
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button>Add Data</Button>
      </DrawerTrigger>
      <DrawerContent direction="right">
        <DrawerHeader>
          <div className="flex flex-row items-center gap-3">
            {logo && (
              <Image src={logo} alt="Source logo" width={24} height={24} className="h-6 w-6 object-contain" />
            )}
            <DrawerTitle>{pageTitle}</DrawerTitle>
          </div>
          <Button onClick={closeDrawer}>Close</Button>
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
        <DrawerFooter>{pageActions || <Button onClick={goBack}>Back</Button>}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
