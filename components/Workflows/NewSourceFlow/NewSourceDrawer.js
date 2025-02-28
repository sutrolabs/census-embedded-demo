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
  const { pageTitle, pageActions, closeDrawer, goBack } = useSourceFlow()
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button>Add Data</Button>
      </DrawerTrigger>
      <DrawerContent direction="right">
        <DrawerHeader>
          <DrawerTitle>{pageTitle}</DrawerTitle>
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
