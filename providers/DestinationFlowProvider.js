import { createContext, useContext, useState, useCallback, useEffect } from "react"

import Button from "@components/Button/Button/Button"
import { censusFrontendBaseUrl } from "@utils/url"

// Steps in the connection flow
export const STEPS = {
  INITIAL: "initial",
  DESTINATION_TYPES: "destinationTypes",
  CONNECT_DESTINATION: "connect",
  CONFIGURE_DESTINATION: "configure",
  REVIEW: "review",
}

const DestinationFlowContext = createContext(null)

export function DestinationFlowProvider({
  children,
  workspaceAccessToken,
  destinationConnectLinks,
  refetchDestinationConnectLinks,
  destinations,
  setDestinations,
  availableDestinationTypes,
  selectedSegment,
  setSyncs,
}) {
  // Flow state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(STEPS.INITIAL)
  const [selectedDestinationType, setSelectedDestinationType] = useState(null)
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [existingDestinationId, setExistingDestinationId] = useState(null)

  // Page title and actions state
  const [pageTitle, setPageTitle] = useState("")
  const [pageActions, setPageActions] = useState(null)

  // Data state
  const [existingDestinations, setExistingDestinations] = useState([])
  const [loadingDestinationTypes, setLoadingDestinationTypes] = useState(false)
  const [loadingDestinations, setLoadingDestinations] = useState(false)
  const [error, setError] = useState(null)

  // Navigation handlers
  const openDrawer = useCallback((destinationId = null) => {
    setCurrentStep(STEPS.INITIAL)
    setIsDrawerOpen(true)
  }, [])

  const openToDestination = useCallback((destinationId = null) => {
    setExistingDestinationId(destinationId)
    setCurrentStep(destinationId ? STEPS.CONFIGURE_DESTINATION : STEPS.INITIAL)
    setIsDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
    setCurrentStep(STEPS.INITIAL)
    setSelectedDestinationType(null)
    setSelectedDestination(null)
    setExistingDestinationId(null)
  }, [])

  const goToDestinationTypes = useCallback(() => setCurrentStep(STEPS.DESTINATION_TYPES), [])

  const goToConnectDestination = useCallback((destinationType) => {
    setSelectedDestinationType(destinationType)
    setCurrentStep(STEPS.CONNECT_DESTINATION)
  }, [])

  const goToConfigureDestination = useCallback((destination) => {
    setSelectedDestination(destination)
    setCurrentStep(STEPS.CONFIGURE_DESTINATION)
  }, [])

  const goToReview = useCallback(() => {
    setCurrentStep(STEPS.REVIEW)
  }, [])

  const goBack = useCallback(() => {
    switch (currentStep) {
      case STEPS.DESTINATION_TYPES:
        setCurrentStep(STEPS.INITIAL)
        break
      case STEPS.CONNECT_DESTINATION:
        setCurrentStep(STEPS.DESTINATION_TYPES)
        break
      case STEPS.CONFIGURE_DESTINATION:
        setCurrentStep(STEPS.INITIAL)
        break
      case STEPS.REVIEW:
        setCurrentStep(STEPS.CONFIGURE_DESTINATION)
        break
      default:
        closeDrawer()
    }
  }, [currentStep, closeDrawer])

  useEffect(() => {
    const updatePageTitleAndActions = () => {
      switch (currentStep) {
        case STEPS.INITIAL:
          setPageTitle("Add Destination")
          setPageActions(null)
          break
        case STEPS.DESTINATION_TYPES:
          setPageTitle("Select a Destination Type")
          setPageActions(
            <Button onClick={goBack}>
              <i className="fa-regular fa-chevron-left" />
            </Button>,
          )
          break
        case STEPS.CONNECT_DESTINATION:
          setPageTitle(`Connect ${selectedDestinationType?.label || "Destination"}`)
          setPageActions(
            <Button onClick={goBack}>
              <i className="fa-regular fa-chevron-left" />
            </Button>,
          )
          break
        case STEPS.CONFIGURE_DESTINATION:
          setPageTitle(`Configure ${selectedDestination?.name || "Destination"}`)
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
          setPageTitle("Connect Destination")
          setPageActions(null)
      }
    }

    updatePageTitleAndActions()
  }, [currentStep, selectedDestinationType, selectedDestination, goBack])

  useEffect(() => {
    setExistingDestinations(destinations || [])
  }, [destinations])

  const assembleSyncManagementLink = useCallback(() => {
    if (!workspaceAccessToken || !selectedSegment || !selectedDestination) {
      return null
    }

    const params = new URLSearchParams({
      auth: workspaceAccessToken,
      source_hidden: "true",
      destination_hidden: "true",
      model_id: selectedSegment.id, // Using segment as the source/model
      destination_connection_id: selectedDestination.id,
      destination_object_name: selectedDestination.object_name || "",
    })

    return `${censusFrontendBaseUrl}?${params.toString()}`
  }, [workspaceAccessToken, selectedSegment, selectedDestination])

  const value = {
    // State
    STEPS,
    isDrawerOpen,
    currentStep,
    selectedDestinationType,
    selectedDestination,
    existingDestinationId,
    existingDestinations,
    loadingDestinationTypes,
    loadingDestinations,
    selectedSegment,
    error,
    pageTitle,
    pageActions,

    // Actions
    openDrawer,
    openToDestination,
    closeDrawer,
    goToDestinationTypes,
    goToConnectDestination,
    goToConfigureDestination,
    goToReview,
    goBack,
    setError,

    // Props passed through
    workspaceAccessToken,
    destinationConnectLinks,
    refetchDestinationConnectLinks,
    availableDestinationTypes,
    setSyncs,

    // Add the new function to the context
    assembleSyncManagementLink,
  }

  return <DestinationFlowContext.Provider value={value}>{children}</DestinationFlowContext.Provider>
}

export function useDestinationFlow() {
  const context = useContext(DestinationFlowContext)
  if (!context) {
    throw new Error("useDestinationFlow must be used within a DestinationFlowProvider")
  }
  return context
}
