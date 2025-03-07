import Image from "next/image"

import Button from "@components/Button/Button/Button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@components/Drawer/Drawer"
import DestinationConnectionFlow from "@components/Workflows/NewDestinationFlow/DestinationConnectionFlow"
import { getLogoForDestinationType } from "@hooks/useDestinationLogos"
import { useDestinationFlow } from "@providers/DestinationFlowProvider"

export default function NewDestinationDrawer() {
  const {
    pageTitle,
    pageActions,
    closeDrawer,
    isDrawerOpen,
    openDrawer,
    STEPS,
    selectedDestinationType,
    currentStep,
  } = useDestinationFlow()

  const getLogo = () => {
    if (
      currentStep === STEPS.CONNECT_DESTINATION ||
      currentStep === STEPS.CONFIGURE_DESTINATION ||
      currentStep === STEPS.REVIEW
    ) {
      if (selectedDestinationType) {
        return getLogoForDestinationType(selectedDestinationType)
      }
    }
    return null
  }

  const logo = getLogo()

  return (
    <Drawer direction="right" dismissible={false} open={isDrawerOpen}>
      <DrawerTrigger asChild>
        <Button onClick={openDrawer}>Add Destination</Button>
      </DrawerTrigger>
      <DrawerContent direction="right">
        <DrawerHeader>
          <div className="flex flex-row items-center gap-6">
            {pageActions}
            <div className="flex items-center gap-3">
              {logo && (
                <Image
                  src={logo}
                  alt="Destination logo"
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
        <DestinationConnectionFlow />
      </DrawerContent>
    </Drawer>
  )
}
