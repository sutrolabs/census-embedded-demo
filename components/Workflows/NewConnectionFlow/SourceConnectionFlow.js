import { useState, useEffect } from "react"

import ExistingSourcesList from "@components/Workflows/NewConnectionFlow/ExistingSourcesList"
import SourceConnectionForm from "@components/Workflows/NewConnectionFlow/Steps/SourceConnectionForm"
import SourceObjectSelection from "@components/Workflows/NewConnectionFlow/Steps/SourceObjectSelection"
import SourceTypeSelection from "@components/Workflows/NewConnectionFlow/Steps/SourceTypeSelection"

// Steps in the connection flow
const STEPS = {
  INITIAL: "initial", // Choose between existing or new source
  SOURCE_TYPES: "sourceTypes", // Select source type for new connection
  CONNECT_SOURCE: "connect", // Connect to selected source type
  SELECT_OBJECTS: "objects", // Select objects to sync from connected source
  REVIEW: "review", // Review selections before finalizing
}

export default function SourceConnectionFlow({
  workspaceAccessToken,
  onComplete,
  onCancel,
  initialStep = STEPS.INITIAL,
  existingSourceId = null,
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
  // Flow state
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [selectedSourceType, setSelectedSourceType] = useState(null)
  const [selectedSource, setSelectedSource] = useState(null)
  const [selectedObjects, setSelectedObjects] = useState([])

  // Data state
  const [availableSourceTypes, setAvailableSourceTypes] = useState([])
  const [existingSources, setExistingSources] = useState([])
  const [sourceObjects, setSourceObjects] = useState([])

  // Loading states
  const [loadingSourceTypes, setLoadingSourceTypes] = useState(false)
  const [loadingSources, setLoadingSources] = useState(false)
  const [loadingObjects, setLoadingObjects] = useState(false)
  const [error, setError] = useState(null)

  // Add console logging to help debug
  useEffect(() => {}, [sourceConnectLinks, selectedSourceType])

  // Fetch available source types
  useEffect(() => {
    const fetchSourceTypes = async () => {
      setLoadingSourceTypes(true)
      setError(null)
      try {
        const response = await fetch("/api/list_source_types", {
          headers: {
            ["authorization"]: `Bearer ${workspaceAccessToken}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch source types")
        }
        const data = await response.json()
        setAvailableSourceTypes(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingSourceTypes(false)
      }
    }

    fetchSourceTypes()
  }, [workspaceAccessToken])

  // Fetch existing sources
  useEffect(() => {
    const fetchSources = async () => {
      setLoadingSources(true)
      setError(null)
      try {
        const response = await fetch("/api/list_sources", {
          headers: {
            ["authorization"]: `Bearer ${workspaceAccessToken}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch existing sources")
        }
        const data = await response.json()
        setExistingSources(data)

        // If an existing source ID was provided, select it
        if (existingSourceId) {
          const source = data.find((s) => s.id === existingSourceId)
          if (source) {
            setSelectedSource(source)
            setCurrentStep(STEPS.SELECT_OBJECTS)
          }
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingSources(false)
      }
    }

    fetchSources()
  }, [workspaceAccessToken, existingSourceId])

  // Add this useEffect to handle redirects from Census
  useEffect(() => {
    const checkPendingConnection = async () => {
      const pendingConnection = sessionStorage.getItem("pendingSourceConnection")

      if (pendingConnection) {
        // Clear the pending connection from storage
        sessionStorage.removeItem("pendingSourceConnection")

        try {
          // Fetch the latest sources to see if our new source was created
          const response = await fetch("/api/list_sources", {
            headers: {
              ["authorization"]: `Bearer ${workspaceAccessToken}`,
            },
          })

          if (!response.ok) {
            throw new Error("Failed to fetch sources after connection")
          }

          const sources = await response.json()

          // Find the most recently created source
          // This assumes the API returns sources sorted by creation date
          // If not, you may need to sort them or use a different approach
          const newSource = sources[0]

          if (newSource) {
            // Move to the next step with the new source
            setSelectedSource(newSource)
            setCurrentStep(STEPS.SELECT_OBJECTS)
          }
        } catch (err) {
          setError(err.message)
        }
      }
    }

    checkPendingConnection()
  }, [workspaceAccessToken])

  // Navigation handlers
  const goToSourceTypes = () => setCurrentStep(STEPS.SOURCE_TYPES)
  const goToConnectSource = (sourceType) => {
    setSelectedSourceType(sourceType)
    setCurrentStep(STEPS.CONNECT_SOURCE)
  }
  const goToSelectObjects = (source) => {
    setSelectedSource(source)
    setCurrentStep(STEPS.SELECT_OBJECTS)
    // Here you would fetch objects for the selected source
  }
  const goToReview = (objects) => {
    setSelectedObjects(objects)
    setCurrentStep(STEPS.REVIEW)
  }
  const goBack = () => {
    switch (currentStep) {
      case STEPS.SOURCE_TYPES:
        setCurrentStep(STEPS.INITIAL)
        break
      case STEPS.CONNECT_SOURCE:
        setCurrentStep(STEPS.SOURCE_TYPES)
        break
      case STEPS.SELECT_OBJECTS:
        // If we came from an existing source, go to initial
        // Otherwise go back to connect source
        setCurrentStep(STEPS.INITIAL)
        break
      case STEPS.REVIEW:
        setCurrentStep(STEPS.SELECT_OBJECTS)
        break
      default:
        onCancel()
    }
  }

  const handleComplete = () => {
    onComplete({
      source: selectedSource,
      objects: selectedObjects,
    })
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case STEPS.INITIAL:
        return (
          <div className="flex h-full flex-col gap-6">
            <h2 className="text-xl font-semibold">Connect a Data Source</h2>

            <div className="flex flex-col gap-4">
              <button className="rounded border p-4 hover:bg-neutral-50" onClick={goToSourceTypes}>
                Connect a new source
              </button>

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
              <button className="rounded bg-emerald-500 px-4 py-2 text-white" onClick={handleComplete}>
                Complete
              </button>
            </div>
          </div>
        )

      default:
        return <div>Unknown step</div>
    }
  }

  return <div className="h-full">{renderStep()}</div>
}
