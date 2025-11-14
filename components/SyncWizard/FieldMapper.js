import { useState, useEffect } from "react"

import Button from "@components/Button/Button/Button"
import Loading from "@components/Loading/Loading"
import Error_ from "@components/Message/Error_"
import RefreshButton from "@components/SyncWizard/RefreshButton"
import { useEntityRefresh } from "@hooks/useEntityRefresh"
import { useBasicFetch } from "@utils/fetch"

export default function FieldMapper({
  sourceId,
  sourceTable,
  destinationId,
  destinationObjectFullName,
  destinationObjectFields,
  selectedOperation,
  workspaceAccessToken,
  onComplete,
  onBack,
  onFieldsRefresh,
}) {
  const [primaryMapping, setPrimaryMapping] = useState({ from: "", to: "" })
  const [additionalMappings, setAdditionalMappings] = useState([])

  // Pre-populate required field mappings on mount
  useEffect(() => {
    if (!destinationObjectFields?.length) return

    // Find all required fields
    const requiredFields = destinationObjectFields.filter((field) => field.required_for_mapping === true)

    if (requiredFields.length === 0) return

    // Only initialize if additionalMappings is empty (first load)
    if (additionalMappings.length === 0) {
      const requiredMappings = requiredFields.map((field) => ({
        from: "", // User must select source column
        to: field.full_name,
        isRequired: true, // Flag to prevent removal
      }))

      setAdditionalMappings(requiredMappings)
    }
  }, [destinationObjectFields])

  const {
    loading,
    error,
    data: columns,
    refetch: refetchColumns,
  } = useBasicFetch(() => {
    return new Request(
      `/api/list_table_columns?sourceId=${sourceId}&schemaName=${sourceTable.table_schema}&tableName=${sourceTable.table_name}&catalogName=${sourceTable.table_catalog}`,
      {
        method: "GET",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
        },
      },
    )
  })

  // Refresh columns
  const { isRefreshing: isRefreshingColumns, handleRefresh: handleRefreshColumns } = useEntityRefresh({
    refreshFn: async () => {
      const response = await fetch("/api/refresh_table_columns", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
        body: JSON.stringify({
          sourceId,
          tableCatalog: sourceTable.table_catalog,
          tableSchema: sourceTable.table_schema,
          tableName: sourceTable.table_name,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to refresh table columns")
      }

      return await response.json()
    },
    statusFn: async (refreshKey) => {
      const response = await fetch(
        `/api/get_refresh_columns_status?sourceId=${sourceId}&refresh_key=${encodeURIComponent(
          refreshKey,
        )}&tableName=${encodeURIComponent(sourceTable.table_name)}&tableSchema=${encodeURIComponent(
          sourceTable.table_schema,
        )}&tableCatalog=${encodeURIComponent(sourceTable.table_catalog)}`,
        {
          method: "GET",
          headers: {
            ["authorization"]: `Bearer ${workspaceAccessToken}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to get refresh status")
      }

      return await response.json()
    },
    refetchFn: refetchColumns,
    data: columns,
    loading,
    error,
  })

  // Refresh fields
  const { isRefreshing: isRefreshingFields, handleRefresh: handleRefreshFields } = useEntityRefresh({
    refreshFn: async () => {
      const response = await fetch("/api/refresh_destination_fields", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
        body: JSON.stringify({
          destinationId,
          objectFullName: destinationObjectFullName,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to refresh destination fields")
      }

      return await response.json()
    },
    statusFn: async (refreshKey) => {
      const response = await fetch(
        `/api/get_refresh_fields_status?destinationId=${destinationId}&objectFullName=${encodeURIComponent(
          destinationObjectFullName,
        )}&refresh_key=${encodeURIComponent(refreshKey)}`,
        {
          method: "GET",
          headers: {
            ["authorization"]: `Bearer ${workspaceAccessToken}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to get refresh status")
      }

      return await response.json()
    },
    refetchFn: async () => {
      // Refetch the destination object to get updated fields
      const response = await fetch(
        `/api/fetch_destination_object?destinationId=${destinationId}&objectFullName=${encodeURIComponent(
          destinationObjectFullName,
        )}`,
        {
          method: "GET",
          headers: {
            ["authorization"]: `Bearer ${workspaceAccessToken}`,
          },
        },
      )
      if (response.ok) {
        const data = await response.json()
        if (onFieldsRefresh) {
          onFieldsRefresh(data.fields || [])
        }
      }
    },
    data: destinationObjectFields,
    loading: false,
    error: null,
    autoRefresh: false, // Don't auto-refresh fields since they're passed as props
  })

  // Get columns that can be primary identifiers based on operation
  const upsertKeyColumns = columns?.filter((col) => col.can_be_upsert_key) || []

  // Get fields that can be primary identifiers based on operation
  const getPrimaryIdentifierFields = () => {
    if (!destinationObjectFields) return []

    return destinationObjectFields.filter((field) => {
      switch (selectedOperation) {
        case "update":
        case "delete":
          return field.can_be_update_key
        case "insert":
          return field.can_be_insert_key
        default:
          // upsert, mirror, append
          return field.can_be_upsert_key
      }
    })
  }

  const upsertKeyFields = getPrimaryIdentifierFields()

  // Get fields that are already used in mappings (excluding primary)
  const getUsedFields = () => {
    return additionalMappings.map((m) => m.to).filter(Boolean)
  }

  // Get available fields for primary identifier (excluding fields used in additional mappings)
  const getAvailableFieldsForPrimaryIdentifier = () => {
    const usedFields = additionalMappings.map((m) => m.to).filter(Boolean)
    return upsertKeyFields.filter((field) => !usedFields.includes(field.full_name))
  }

  // Get available fields for additional mappings (excluding used ones and primary identifier)
  const getAvailableFieldsForMapping = (currentMappingIndex) => {
    const usedFields = additionalMappings
      .map((m, idx) => (idx !== currentMappingIndex ? m.to : null))
      .filter(Boolean)

    // Also exclude the primary identifier field
    if (primaryMapping.to) {
      usedFields.push(primaryMapping.to)
    }

    return destinationObjectFields?.filter((field) => !usedFields.includes(field.full_name)) || []
  }

  const addMapping = () => {
    setAdditionalMappings([...additionalMappings, { from: "", to: "" }])
  }

  const removeMapping = (index) => {
    const mapping = additionalMappings[index]

    // Prevent removal of required field mappings
    if (mapping?.isRequired === true) {
      console.warn("Cannot remove required field mapping")
      return
    }

    setAdditionalMappings(additionalMappings.filter((_, i) => i !== index))
  }

  const updateAdditionalMapping = (index, field, value) => {
    const newMappings = [...additionalMappings]
    newMappings[index][field] = value
    setAdditionalMappings(newMappings)
  }

  const handleComplete = () => {
    // Convert to Census API format
    const censusMappings = [
      // Primary identifier mapping
      {
        from: {
          data: primaryMapping.from,
          type: "column",
        },
        to: primaryMapping.to,
        is_primary_identifier: true,
      },
      // Additional mappings
      ...additionalMappings
        .filter((m) => m.from && m.to)
        .map((mapping) => ({
          from: {
            data: mapping.from,
            type: "column",
          },
          to: mapping.to,
          is_primary_identifier: false,
        })),
    ]

    onComplete(censusMappings)
  }

  const isValid = () => {
    // Must have primary mapping filled out
    if (!primaryMapping.from || !primaryMapping.to) {
      return false
    }

    // All required field mappings must have source column selected
    const hasIncompleteRequiredMappings = additionalMappings.some((m) => m.isRequired === true && !m.from)
    if (hasIncompleteRequiredMappings) {
      return false
    }

    // All optional mappings must be complete or empty
    const optionalMappings = additionalMappings.filter((m) => !m.isRequired)
    return optionalMappings.every((m) => (m.from && m.to) || (!m.from && !m.to))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loading />
      </div>
    )
  }

  if (error) {
    return <Error_ message="Failed to load source columns" />
  }

  const isRefreshing = isRefreshingColumns || isRefreshingFields

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button onClick={onBack} className="px-2">
          <i className="fa-solid fa-arrow-left" />
        </Button>
        <div className="flex flex-1 items-center justify-between">
          <h3 className="text-lg font-medium text-neutral-700">Map Fields</h3>
          <div className="flex gap-2">
            <RefreshButton
              onRefresh={handleRefreshColumns}
              isRefreshing={isRefreshingColumns}
              label="Refresh Columns"
            />
            <RefreshButton
              onRefresh={handleRefreshFields}
              isRefreshing={isRefreshingFields}
              label="Refresh Fields"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
        <p className="text-sm text-neutral-600">
          Map columns from your source table to fields in your destination object. The primary identifier is
          required and is used to match records between source and destination.
        </p>
      </div>

      {isRefreshing && (
        <div className="flex items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 py-12">
          <div className="flex flex-col items-center gap-3">
            <Loading />
            <p className="text-sm text-neutral-600">
              {isRefreshingColumns && "Refreshing table columns..."}
              {isRefreshingFields && "Refreshing destination fields..."}
            </p>
          </div>
        </div>
      )}

      {/* Primary Identifier Mapping */}
      {!isRefreshing && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-neutral-700">
            Primary Identifier <span className="text-red-500">*</span>
          </h4>
          <div className="rounded-md border-2 border-emerald-200 bg-emerald-50/50 p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Source Column <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={primaryMapping.from}
                  onChange={(e) => setPrimaryMapping({ ...primaryMapping, from: e.target.value })}
                >
                  <option value="">Select a column</option>
                  {upsertKeyColumns.map((column) => (
                    <option key={column.name} value={column.name}>
                      {column.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Destination Field <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={primaryMapping.to}
                  onChange={(e) => setPrimaryMapping({ ...primaryMapping, to: e.target.value })}
                >
                  <option value="">Select a field</option>
                  {getAvailableFieldsForPrimaryIdentifier().map((field) => (
                    <option key={field.full_name} value={field.full_name}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Mappings */}
      {!isRefreshing && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-neutral-700">
            Additional Field Mappings
            {additionalMappings.some((m) => m.isRequired) && (
              <span className="ml-2 text-xs font-normal text-orange-600">
                (* Some fields are required by the destination)
              </span>
            )}
          </h4>
          <div className="space-y-3">
            {additionalMappings.map((mapping, index) => {
              const isRequired = mapping.isRequired === true

              return (
                <div
                  key={index}
                  className={`rounded-md border p-4 ${
                    isRequired ? "border-orange-300 bg-orange-50/30" : "border-neutral-200 bg-white"
                  }`}
                >
                  {/* Show required badge */}
                  {isRequired && (
                    <div className="mb-2 flex items-center gap-1 text-xs font-semibold text-orange-700">
                      <i className="fa-solid fa-asterisk text-[8px]" />
                      <span>REQUIRED FIELD</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Source Column{isRequired && <span className="text-red-500"> *</span>}
                      </label>
                      <select
                        className={`w-full rounded-md border px-3 py-2 text-neutral-700 focus:outline-none focus:ring-1 ${
                          isRequired
                            ? "border-orange-300 bg-orange-50/20 focus:border-orange-500 focus:ring-orange-500"
                            : "border-neutral-300 focus:border-emerald-500 focus:ring-emerald-500"
                        }`}
                        value={mapping.from}
                        onChange={(e) => updateAdditionalMapping(index, "from", e.target.value)}
                      >
                        <option value="">Select a column</option>
                        {columns?.map((column) => (
                          <option key={column.name} value={column.name}>
                            {column.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Destination Field{isRequired && <span className="text-red-500"> *</span>}
                      </label>
                      <select
                        className={`w-full rounded-md border px-3 py-2 text-neutral-700 focus:outline-none focus:ring-1 ${
                          isRequired
                            ? "border-orange-300 bg-orange-50/20 focus:border-orange-500 focus:ring-orange-500"
                            : "border-neutral-300 focus:border-emerald-500 focus:ring-emerald-500"
                        }`}
                        value={mapping.to}
                        onChange={(e) => updateAdditionalMapping(index, "to", e.target.value)}
                        disabled={isRequired}
                      >
                        <option value="">Select a field</option>
                        {getAvailableFieldsForMapping(index).map((field) => (
                          <option key={field.full_name} value={field.full_name}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Remove button - only show for non-required mappings */}
                  <div className="mt-3 flex justify-end">
                    {!isRequired && (
                      <Button onClick={() => removeMapping(index)} className="text-red-600" size="small">
                        <i className="fa-solid fa-trash" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!isRefreshing && (
        <div className="flex gap-3">
          <Button onClick={addMapping} className="flex items-center gap-2">
            <i className="fa-solid fa-plus" />
            Add Field Mapping
          </Button>
          <Button solid disabled={!isValid()} onClick={handleComplete}>
            Create Sync
          </Button>
        </div>
      )}
    </div>
  )
}
