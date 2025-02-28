import { createContext, useContext, useState, useCallback, useEffect } from "react"

import Button from "@components/Button"

// Steps in the connection flow
export const STEPS = {
  INITIAL: "initial", // Choose between existing or new source
  SOURCE_TYPES: "sourceTypes", // Select source type for new connection
  CONNECT_SOURCE: "connect", // Connect to selected source type
  SELECT_OBJECTS: "objects", // Select objects to sync from connected source
  REVIEW: "review", // Review selections before finalizing
}

const SourceFlowContext = createContext(null)

export function SourceFlowProvider({
  children,
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
  sources,
  availableSourceTypes: initialSourceTypes,
}) {
  // Flow state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(STEPS.INITIAL)
  const [selectedSourceType, setSelectedSourceType] = useState(null)
  const [selectedSource, setSelectedSource] = useState(null)
  const [selectedObjects, setSelectedObjects] = useState([])
  const [existingSourceId, setExistingSourceId] = useState(null)

  // Page title and actions state
  const [pageTitle, setPageTitle] = useState("")
  const [pageActions, setPageActions] = useState(null)

  // Data state
  const [availableSourceTypes, setAvailableSourceTypes] = useState(initialSourceTypes)
  const [existingSources, setExistingSources] = useState([])
  const [sourceObjects, setSourceObjects] = useState([])

  // Loading states
  const [loadingSourceTypes, setLoadingSourceTypes] = useState(false)
  const [loadingSources, setLoadingSources] = useState(false)
  const [loadingObjects, setLoadingObjects] = useState(false)
  const [error, setError] = useState(null)

  // Navigation handlers
  const openDrawer = useCallback((sourceId = null) => {
    setExistingSourceId(sourceId)
    setCurrentStep(sourceId ? STEPS.SELECT_OBJECTS : STEPS.INITIAL)
    setIsDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
    setCurrentStep(STEPS.INITIAL)
    setSelectedSourceType(null)
    setSelectedSource(null)
    setSelectedObjects([])
    setExistingSourceId(null)
  }, [])

  const goToSourceTypes = useCallback(() => setCurrentStep(STEPS.SOURCE_TYPES), [])

  const goToConnectSource = useCallback((sourceType) => {
    setSelectedSourceType(sourceType)
    setCurrentStep(STEPS.CONNECT_SOURCE)
  }, [])

  const goToSelectObjects = useCallback((source) => {
    setSelectedSource(source)
    setCurrentStep(STEPS.SELECT_OBJECTS)
  }, [])

  const goToReview = useCallback((objects) => {
    setSelectedObjects(objects)
    setCurrentStep(STEPS.REVIEW)
  }, [])

  const goBack = useCallback(() => {
    switch (currentStep) {
      case STEPS.SOURCE_TYPES:
        setCurrentStep(STEPS.INITIAL)
        break
      case STEPS.CONNECT_SOURCE:
        setCurrentStep(STEPS.SOURCE_TYPES)
        break
      case STEPS.SELECT_OBJECTS:
        setCurrentStep(STEPS.INITIAL)
        break
      case STEPS.REVIEW:
        setCurrentStep(STEPS.SELECT_OBJECTS)
        break
      default:
        closeDrawer()
    }
  }, [currentStep, closeDrawer])

  useEffect(() => {
    const updatePageTitleAndActions = () => {
      switch (currentStep) {
        case STEPS.INITIAL:
          setPageTitle("Import Data")
          setPageActions(null)
          break
        case STEPS.SOURCE_TYPES:
          setPageTitle("Select a Source Type")
          setPageActions(
            <Button onClick={goBack}>
              <i className="fa-regular fa-chevron-left" />
            </Button>,
          )
          break
        case STEPS.CONNECT_SOURCE:
          setPageTitle(`Connect ${selectedSourceType?.label || "Source"}`)
          setPageActions(
            <Button onClick={goBack}>
              <i className="fa-regular fa-chevron-left" />
            </Button>,
          )
          break
        case STEPS.SELECT_OBJECTS:
          setPageTitle(`Configure Syncs for ${selectedSource?.name || "Source"}`)
          setPageActions(
            <Button onClick={goBack}>
              <i className="fa-regular fa-chevron-left" />
            </Button>,
          )
          break
        case STEPS.REVIEW:
          setPageTitle("Review and Confirm")
          setPageActions(
            <Button onClick={goBack}>
              <i className="fa-regular fa-chevron-left" />
            </Button>,
          )
          break
        default:
          setPageTitle("Connect Data")
          setPageActions(null)
      }
    }

    updatePageTitleAndActions()
  }, [currentStep, selectedSourceType, selectedSource, goBack, closeDrawer])

  useEffect(() => {
    // Set existing sources from the sources prop
    setExistingSources(sources || [])
  }, [sources])

  useEffect(() => {
    // Fetch source types when needed
    const fetchSourceTypes = async () => {
      if (availableSourceTypes.length === 0) {
        setLoadingSourceTypes(true)
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
    }

    // Only fetch when drawer is open and we're at the source types step
    if (isDrawerOpen && currentStep === STEPS.SOURCE_TYPES) {
      fetchSourceTypes()
    }
  }, [isDrawerOpen, currentStep, workspaceAccessToken, availableSourceTypes.length])

  const value = {
    // State
    STEPS,
    isDrawerOpen,
    currentStep,
    selectedSourceType,
    selectedSource,
    selectedObjects,
    existingSourceId,
    availableSourceTypes,
    existingSources,
    sourceObjects,
    loadingSourceTypes,
    loadingSources,
    loadingObjects,
    error,
    pageTitle,
    pageActions,

    // Actions
    openDrawer,
    closeDrawer,
    goToSourceTypes,
    goToConnectSource,
    goToSelectObjects,
    goToReview,
    goBack,
    setError,
    setPageTitle,
    setPageActions,

    // Props passed through
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
  }

  return <SourceFlowContext.Provider value={value}>{children}</SourceFlowContext.Provider>
}

export function useSourceFlow() {
  const context = useContext(SourceFlowContext)
  if (!context) {
    throw new Error("useSourceFlow must be used within a ConnectionFlowProvider")
  }
  return context
}
