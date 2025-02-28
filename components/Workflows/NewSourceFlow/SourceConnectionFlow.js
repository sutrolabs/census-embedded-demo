import Button from "@components/Button"
import { useSourceFlow } from "@components/Contexts/SourceFlowContext"
import ExistingSourcesList from "@components/Workflows/NewSourceFlow/ExistingSourcesList"
import SourceConnectionForm from "@components/Workflows/NewSourceFlow/Steps/SourceConnectionForm"
import SourceObjectSelection from "@components/Workflows/NewSourceFlow/Steps/SourceObjectSelection"
import SourceTypeSelection from "@components/Workflows/NewSourceFlow/Steps/SourceTypeSelection"

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
    runs,
    devMode,
    embedMode,
  } = useSourceFlow()

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case STEPS.INITIAL:
        return (
          <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
            <h2 className="text-xl font-semibold">Connect a Data Source</h2>

            <div className="flex flex-col gap-4">
              <Button onClick={goToSourceTypes}>Connect a new source</Button>

              <div className="mt-4">
                <h3 className="mb-2 text-lg font-medium">Or use an existing source</h3>
                <ExistingSourcesList
                  sources={existingSources}
                  loading={loadingSources}
                  error={error}
                  onSelectSource={goToSelectObjects}
                />
              </div>
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
          />
        )

      case STEPS.SELECT_OBJECTS:
        return (
          <SourceObjectSelection
            source={selectedSource}
            workspaceAccessToken={workspaceAccessToken}
            onObjectsSelected={goToReview}
            onBack={goBack}
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

  return <>{renderStep()}</>
}
