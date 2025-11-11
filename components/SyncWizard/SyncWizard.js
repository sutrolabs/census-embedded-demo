import { useState } from "react"

import Loading from "@components/Loading/Loading"
import Error_ from "@components/Message/Error_"
import DestinationObjectSelector from "@components/SyncWizard/DestinationObjectSelector"
import FieldMapper from "@components/SyncWizard/FieldMapper"
import SourceTableSelector from "@components/SyncWizard/SourceTableSelector"
import SyncBehaviorSelector from "@components/SyncWizard/SyncBehaviorSelector"

const STEPS = {
  SELECT_SOURCE_TABLE: "SELECT_SOURCE_TABLE",
  SELECT_DESTINATION_OBJECT: "SELECT_DESTINATION_OBJECT",
  SELECT_SYNC_BEHAVIOR: "SELECT_SYNC_BEHAVIOR",
  MAP_FIELDS: "MAP_FIELDS",
  CREATING: "CREATING",
}

export default function SyncWizard({ sourceId, destinationId, workspaceAccessToken, onComplete }) {
  const [currentStep, setCurrentStep] = useState(STEPS.SELECT_SOURCE_TABLE)
  const [selectedSourceTable, setSelectedSourceTable] = useState(null)
  const [selectedDestinationObject, setSelectedDestinationObject] = useState(null)
  const [selectedOperation, setSelectedOperation] = useState(null)
  const [destinationObjectDetails, setDestinationObjectDetails] = useState(null)
  const [error, setError] = useState(null)

  const handleSourceTableSelect = (table) => {
    setSelectedSourceTable(table)
    setCurrentStep(STEPS.SELECT_DESTINATION_OBJECT)
  }

  const handleDestinationObjectSelect = (object) => {
    setSelectedDestinationObject(object)
    setCurrentStep(STEPS.SELECT_SYNC_BEHAVIOR)
  }

  const handleOperationSelect = (operation, objectDetails) => {
    setSelectedOperation(operation)
    setDestinationObjectDetails(objectDetails)
    setCurrentStep(STEPS.MAP_FIELDS)
  }

  const handleFieldMappingComplete = async (mappings) => {
    setCurrentStep(STEPS.CREATING)
    setError(null)

    try {
      const response = await fetch("/api/create_sync", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
        body: JSON.stringify({
          sourceId,
          sourceTableName: selectedSourceTable.table_name,
          sourceTableCatalog: selectedSourceTable.table_catalog,
          sourceTableSchema: selectedSourceTable.table_schema,
          destinationId,
          destinationObject: selectedDestinationObject.full_name,
          operation: selectedOperation,
          mappings,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create sync")
      }

      const data = await response.json()

      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(data)
      }

      // Reset wizard to initial state
      setCurrentStep(STEPS.SELECT_SOURCE_TABLE)
      setSelectedSourceTable(null)
      setSelectedDestinationObject(null)
      setSelectedOperation(null)
      setDestinationObjectDetails(null)
    } catch (err) {
      setError(err.message)
      setCurrentStep(STEPS.MAP_FIELDS)
    }
  }

  if (currentStep === STEPS.CREATING) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-md border border-neutral-200 bg-white p-8">
        <Loading />
        <p className="text-neutral-600">Creating your sync...</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-neutral-200 bg-white p-6">
      {error && (
        <div className="mb-4">
          <Error_ message={error} />
        </div>
      )}

      {currentStep === STEPS.SELECT_SOURCE_TABLE && (
        <SourceTableSelector
          sourceId={sourceId}
          workspaceAccessToken={workspaceAccessToken}
          onSelect={handleSourceTableSelect}
        />
      )}

      {currentStep === STEPS.SELECT_DESTINATION_OBJECT && (
        <DestinationObjectSelector
          destinationId={destinationId}
          workspaceAccessToken={workspaceAccessToken}
          onSelect={handleDestinationObjectSelect}
          onBack={() => setCurrentStep(STEPS.SELECT_SOURCE_TABLE)}
        />
      )}

      {currentStep === STEPS.SELECT_SYNC_BEHAVIOR && (
        <SyncBehaviorSelector
          destinationId={destinationId}
          destinationObjectFullName={selectedDestinationObject.full_name}
          workspaceAccessToken={workspaceAccessToken}
          onSelect={handleOperationSelect}
          onBack={() => setCurrentStep(STEPS.SELECT_DESTINATION_OBJECT)}
        />
      )}

      {currentStep === STEPS.MAP_FIELDS && (
        <FieldMapper
          sourceId={sourceId}
          sourceTable={selectedSourceTable}
          destinationId={destinationId}
          destinationObjectFullName={selectedDestinationObject.full_name}
          destinationObjectFields={destinationObjectDetails?.fields || []}
          workspaceAccessToken={workspaceAccessToken}
          onComplete={handleFieldMappingComplete}
          onBack={() => setCurrentStep(STEPS.SELECT_SYNC_BEHAVIOR)}
          onFieldsRefresh={(updatedFields) => {
            setDestinationObjectDetails({ ...destinationObjectDetails, fields: updatedFields })
          }}
        />
      )}
    </div>
  )
}
