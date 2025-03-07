import Button from "@components/Button/Button/Button"
import DestinationConfiguration from "@components/Workflows/NewDestinationFlow/Steps/DestinationConfiguration"
import DestinationConnectionForm from "@components/Workflows/NewDestinationFlow/Steps/DestinationConnectionForm"
import DestinationTypeSelection from "@components/Workflows/NewDestinationFlow/Steps/DestinationTypeSelection"
import { useDestinationFlow } from "@providers/DestinationFlowProvider"

export default function DestinationConnectionFlow() {
  const {
    STEPS,
    currentStep,
    selectedDestinationType,
    selectedDestination,
    existingDestinations,
    loadingDestinations,
    error,
    goToDestinationTypes,
    goToConnectDestination,
    goToConfigureDestination,
    goToReview,
    goBack,
    closeDrawer,
    workspaceAccessToken,
    destinationConnectLinks,
    refetchDestinationConnectLinks,
    availableDestinationTypes,
    loadingDestinationTypes,
  } = useDestinationFlow()

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case STEPS.INITIAL:
        return (
          <div className="flex h-full flex-col gap-12 overflow-y-auto">
            {existingDestinations.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-lg font-medium">Configure existing destination</span>
                <div className="flex flex-col gap-2">
                  {existingDestinations.map((destination) => (
                    <Button
                      key={destination.id}
                      className="flex items-center justify-between p-4 text-left"
                      onClick={() => goToConfigureDestination(destination)}
                    >
                      <span>{destination.name}</span>
                      <i className="fa-regular fa-chevron-right" />
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <span className="text-lg font-medium">Connect a new destination</span>
              <Button className="py-4 text-lg" onClick={goToDestinationTypes}>
                Add New Destination
              </Button>
            </div>
          </div>
        )

      case STEPS.DESTINATION_TYPES:
        return (
          <DestinationTypeSelection
            destinationTypes={availableDestinationTypes}
            loading={loadingDestinationTypes}
            error={error}
            onSelectDestinationType={goToConnectDestination}
            onBack={goBack}
          />
        )

      case STEPS.CONNECT_DESTINATION:
        return (
          <DestinationConnectionForm
            destinationType={selectedDestinationType}
            workspaceAccessToken={workspaceAccessToken}
            onDestinationConnected={goToConfigureDestination}
            onBack={goBack}
            destinationConnectLinks={destinationConnectLinks}
            refetchDestinationConnectLinks={refetchDestinationConnectLinks}
          />
        )

      case STEPS.CONFIGURE_DESTINATION:
        return (
          <DestinationConfiguration
            destination={selectedDestination}
            workspaceAccessToken={workspaceAccessToken}
            onConfigurationComplete={goToReview}
            onBack={goBack}
          />
        )

      case STEPS.REVIEW:
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Review and Confirm</h2>

            <div className="rounded bg-neutral-50 p-4">
              <h3 className="font-medium">Selected Destination</h3>
              <p>{selectedDestination?.name || "Unknown destination"}</p>

              <h3 className="mt-4 font-medium">Configuration</h3>
              <p>Your destination is ready to receive data.</p>
            </div>

            <div className="mt-4 flex justify-between">
              <Button onClick={goBack}>Back</Button>
              <Button onClick={closeDrawer} variant="primary">
                Complete
              </Button>
            </div>
          </div>
        )

      default:
        return <div>Unknown step</div>
    }
  }

  return <div className="flex h-full w-full flex-col overflow-hidden p-6">{renderStep()}</div>
}
