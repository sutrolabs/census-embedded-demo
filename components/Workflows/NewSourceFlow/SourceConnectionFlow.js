import Button from "@components/Button/Button/Button"
import ExistingSourcesList from "@components/Workflows/NewSourceFlow/ExistingSourcesList"
import SourceConnectionForm from "@components/Workflows/NewSourceFlow/Steps/SourceConnectionForm"
import SourceObjectSelection from "@components/Workflows/NewSourceFlow/Steps/SourceObjectSelection"
import SourceTypeSelection from "@components/Workflows/NewSourceFlow/Steps/SourceTypeSelection"
import { useSourceFlow } from "@providers/SourceFlowProvider"

export default function SourceConnectionFlow() {
  const {
    STEPS,
    currentStep,
    selectedSourceType,
    selectedSource,
    selectedObjects,
    availableSourceTypes,
    existingSources,
    loadingSourceTypes,
    loadingSources,
    error,
    goToSourceTypes,
    goToConnectSource,
    goToSelectObjects,
    goToReview,
    goBack,
    closeDrawer,
    workspaceAccessToken,
    sourceConnectLinks,
    refetchSourceConnectLinks,
    syncManagementLinks,
    refetchSyncManagementLinks,
    syncs,
    setSyncs,
    refetchSyncs,
    runsLoading,
    destinations,
    runs,
    devMode,
    embedMode,
  } = useSourceFlow()

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case STEPS.INITIAL:
        return (
          <div className="flex h-full flex-col gap-12 overflow-y-auto">
            {existingSources.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-lg font-medium">Use an existing source</span>
                <ExistingSourcesList
                  sources={existingSources}
                  loading={loadingSources}
                  error={error}
                  onSelectSource={goToSelectObjects}
                />
              </div>
            )}
            <div className="flex flex-col gap-3">
              <span className="text-lg font-medium">Connect a new source</span>
              <Button className="py-4 text-lg" onClick={goToSourceTypes}>
                Connect a Source
              </Button>
            </div>
          </div>
        )

      case STEPS.SOURCE_TYPES:
        return (
          <SourceTypeSelection
            sourceTypes={availableSourceTypes}
            loading={loadingSourceTypes}
            error={error}
            onSelectSourceType={goToConnectSource}
            onBack={goBack}
            showOnlyCreatableViaLink={true}
          />
        )

      case STEPS.CONNECT_SOURCE:
        return (
          <SourceConnectionForm
            sourceType={selectedSourceType}
            workspaceAccessToken={workspaceAccessToken}
            onSourceConnected={goToSelectObjects}
            onBack={goBack}
            sourceConnectLinks={sourceConnectLinks}
            refetchSourceConnectLinks={refetchSourceConnectLinks}
            embedMode={embedMode}
            devMode={devMode}
          />
        )

      case STEPS.SELECT_OBJECTS:
        return (
          <SourceObjectSelection
            source={selectedSource}
            workspaceAccessToken={workspaceAccessToken}
            onObjectsSelected={goToReview}
            onBack={goBack}
            destinations={destinations}
            syncs={syncs}
            setSyncs={setSyncs}
            refetchSyncs={refetchSyncs}
            syncManagementLinks={syncManagementLinks}
            refetchSyncManagementLinks={refetchSyncManagementLinks}
            runsLoading={runsLoading}
            runs={runs}
            devMode={devMode}
            embedMode={embedMode}
          />
        )

      case STEPS.REVIEW:
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Review and Confirm</h2>

            <div className="rounded bg-neutral-50 p-4">
              <h3 className="font-medium">Selected Source</h3>
              <p>{selectedSource?.name || "Unknown source"}</p>

              <h3 className="mt-4 font-medium">Selected Objects</h3>
              <ul className="list-disc pl-5">
                {selectedObjects.map((obj) => (
                  <li key={obj.id}>{obj.name}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex justify-between">
              <button className="rounded border px-4 py-2" onClick={goBack}>
                Back
              </button>
              <button className="rounded bg-emerald-500 px-4 py-2 text-white" onClick={closeDrawer}>
                Complete
              </button>
            </div>
          </div>
        )

      default:
        return <div>Unknown step</div>
    }
  }

  return <div className="flex h-full w-full flex-col overflow-hidden p-6">{renderStep()}</div>
}
