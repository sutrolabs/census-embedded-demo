# SyncWizard Implementation Guide

This document explains the SyncWizard implementation in this project, which provides a step-by-step interface for users to create data syncs between sources and destinations using the Census API.

## ⚠️ Important: Census API Reference

**When working with the Census API, always refer to the OpenAPI specification:**

🔗 **https://developers.getcensus.com/openapi/compiled/workspace_management.yaml**

The OpenAPI spec is the source of truth for:
- Endpoint paths and methods
- Request/response schemas
- Required and optional parameters
- Field types and validation rules

This is critical for ensuring API calls are correctly formatted and all available options are utilized.

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Components](#components)
4. [Census API Integration](#census-api-integration)
5. [Reusable Utilities](#reusable-utilities)
6. [Key Features](#key-features)
7. [Usage Example](#usage-example)
8. [Field Mapping Rules](#field-mapping-rules)
9. [Refresh Pattern](#refresh-pattern)
10. [Future Enhancements](#future-enhancements)
11. [Conclusion](#conclusion)

## Overview

The SyncWizard is a multi-step wizard that guides users through creating a Census sync:

1. **Select Source Table** - Choose which table to sync from
2. **Select Destination Object** - Choose where to sync data to
3. **Select Sync Behavior** - Choose the operation (update, upsert, insert, etc.)
4. **Map Fields** - Map source columns to destination fields and set primary identifier
5. **Create Sync** - Execute the sync creation via Census API

## Architecture

### Component Hierarchy

```
SyncWizard (Main orchestrator)
├── SourceTableSelector
├── DestinationObjectSelector
├── SyncBehaviorSelector
└── FieldMapper
```

### State Management

The main `SyncWizard` component manages the wizard state:
- Current step
- Selected source table
- Selected destination object
- Selected operation
- Destination object details (including fields)

Each sub-component is rendered conditionally based on the current step and receives callbacks to advance the wizard.

## Components

### 1. SyncWizard (`components/SyncWizard/SyncWizard.js`)

**Props:**
- `sourceId` - Census source connection ID
- `destinationId` - Census destination connection ID
- `workspaceAccessToken` - Census API authentication token
- `onComplete` - Optional callback when sync is created

**Key Features:**
- Manages wizard flow through 5 steps
- Maintains state for all selections
- Handles sync creation via API
- Resets wizard after successful creation
- Error handling with user feedback

### 2. SourceTableSelector (`components/SyncWizard/SourceTableSelector.js`)

**Props:**
- `sourceId` - Census source connection ID
- `workspaceAccessToken` - Census API authentication token
- `onSelect` - Callback when table is selected

**Key Features:**
- Searchable dropdown using Command component (cmdk)
- Tables grouped by schema
- Auto-refresh if no tables available
- Manual refresh button

**UI Pattern:**
```jsx
<Command>
  <CommandInput placeholder="Search tables..." />
  <CommandList>
    <CommandGroup heading={schema}>
      <CommandItem onSelect={() => onSelect(table)}>
        {table.table_name}
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

### 3. DestinationObjectSelector (`components/SyncWizard/DestinationObjectSelector.js`)

**Props:**
- `destinationId` - Census destination connection ID
- `workspaceAccessToken` - Census API authentication token
- `onSelect` - Callback when object is selected
- `onBack` - Callback to go back to previous step

**Key Features:**
- Grid of buttons for object selection
- Auto-refresh if no objects available
- Manual refresh button
- Back navigation

### 4. SyncBehaviorSelector (`components/SyncWizard/SyncBehaviorSelector.js`)

**Props:**
- `destinationId` - Census destination connection ID
- `destinationObjectFullName` - Full name of selected destination object
- `workspaceAccessToken` - Census API authentication token
- `onSelect` - Callback when operation is selected (receives operation and objectDetails)
- `onBack` - Callback to go back to previous step

**Key Features:**
- Displays supported operations for the destination object
- Friendly labels and descriptions for each operation
- Fetches full object details (including fields for next step)

**Operation Types:**
- `update` - Update existing records only
- `upsert` - Update existing records or insert new ones
- `insert` - Insert new records only
- `mirror` - Mirror the source data exactly
- `append` - Append new records without checking duplicates
- `delete` - Delete records from destination

### 5. FieldMapper (`components/SyncWizard/FieldMapper.js`)

**Props:**
- `sourceId` - Census source connection ID
- `sourceTable` - Selected source table object
- `destinationId` - Census destination connection ID
- `destinationObjectFullName` - Full name of selected destination object
- `destinationObjectFields` - Array of destination object fields
- `workspaceAccessToken` - Census API authentication token
- `onComplete` - Callback when mapping is complete (receives mappings array)
- `onBack` - Callback to go back to previous step
- `onFieldsRefresh` - Callback when fields are refreshed

**Key Features:**
- Separate primary identifier mapping (required)
- Additional field mappings (optional)
- Two refresh buttons: "Refresh Columns" and "Refresh Fields"
- Auto-refresh if no columns available
- Validation before allowing sync creation

## Census API Integration

This section documents all Census API endpoints used in the SyncWizard flow. Each app API route (in `pages/api/`) is a lightweight proxy that calls the corresponding Census API endpoint.

**⚠️ Critical:** Always refer to the OpenAPI specification at https://developers.getcensus.com/openapi/compiled/workspace_management.yaml for complete request/response schemas, available parameters, and field definitions.

### Data Fetching Endpoints

#### 1. List Source Tables
- **App Route:** `GET /api/list_source_tables`
- **Census API:** `GET /api/v1/sources/{source_id}/tables`
- **Purpose:** Fetch all available tables from the selected source connection
- **Used By:** `SourceTableSelector` component

#### 2. List Destination Objects
- **App Route:** `GET /api/list_destination_objects`
- **Census API:** `GET /api/v1/destinations/{destination_id}/objects`
- **Purpose:** Fetch all available objects from the selected destination connection
- **Used By:** `DestinationObjectSelector` component

#### 3. Fetch Destination Object Details
- **App Route:** `GET /api/fetch_destination_object`
- **Census API:** `GET /api/v1/destinations/{destination_id}/objects/{object_full_name}`
- **Purpose:** Fetch detailed information about a specific destination object including supported operations and fields
- **Used By:** `SyncBehaviorSelector` component

#### 4. List Table Columns
- **App Route:** `GET /api/list_table_columns`
- **Census API:** `GET /api/v1/sources/{source_id}/tables/columns`
- **Purpose:** Fetch all columns for a specific source table
- **Used By:** `FieldMapper` component

---

### Refresh Operations

These endpoints trigger asynchronous refresh jobs that update Census's metadata cache. Each returns a `refresh_key` that must be used when polling the corresponding status endpoint.

#### 5. Refresh Source Tables
- **App Route:** `POST /api/refresh_source_tables`
- **Census API:** `POST /api/v1/sources/{source_id}/refresh_tables`
- **Purpose:** Trigger a refresh of the table list for a source connection
- **Used By:** `SourceTableSelector` component

#### 6. Refresh Table Columns
- **App Route:** `POST /api/refresh_table_columns`
- **Census API:** `POST /api/v1/sources/{source_id}/tables/refresh_columns`
- **Purpose:** Trigger a refresh of the column list for a specific table
- **Used By:** `FieldMapper` component

#### 7. Refresh Destination Objects
- **App Route:** `POST /api/refresh_destination_objects`
- **Census API:** `POST /api/v1/destinations/{destination_id}/refresh_objects`
- **Purpose:** Trigger a refresh of the object list for a destination connection
- **Used By:** `DestinationObjectSelector` component

#### 8. Refresh Destination Fields
- **App Route:** `POST /api/refresh_destination_fields`
- **Census API:** `POST /api/v1/destinations/{destination_id}/objects/{object_full_name}/refresh_fields`
- **Purpose:** Trigger a refresh of the field list for a specific destination object
- **Used By:** `FieldMapper` component

---

### Refresh Status Polling

After triggering a refresh operation, these endpoints are polled to check completion status. The `refresh_key` from the refresh response must be passed as a query parameter.

**⚠️ Important:** Refresh operations can take several minutes for large warehouses (1000+ tables). Always poll until Census reports completion rather than using fixed timeouts.

**Status Values:**
- `"processing"` - Refresh still running, continue polling
- `"completed"` - Refresh finished successfully, safe to refetch data
- `"error"` - Refresh failed, handle error

#### 9. Check Table Refresh Status
- **App Route:** `GET /api/get_refresh_tables_status`
- **Census API:** `GET /api/v1/sources/{source_id}/refresh_tables_status?refresh_key={refresh_key}`
- **Purpose:** Check if a table refresh operation has completed
- **Used By:** `SourceTableSelector` component via `useEntityRefresh` hook

#### 10. Check Column Refresh Status
- **App Route:** `GET /api/get_refresh_columns_status`
- **Census API:** `GET /api/v1/sources/{source_id}/tables/refresh_columns_status` (with query params: `refresh_key`, `table_catalog`, `table_schema`, `table_name`)
- **Purpose:** Check if a column refresh operation has completed
- **Used By:** `FieldMapper` component via `useEntityRefresh` hook

#### 11. Check Object Refresh Status
- **App Route:** `GET /api/get_refresh_objects_status`
- **Census API:** `GET /api/v1/destinations/{destination_id}/refresh_objects_status?refresh_key={refresh_key}`
- **Purpose:** Check if an object refresh operation has completed
- **Used By:** `DestinationObjectSelector` component via `useEntityRefresh` hook

#### 12. Check Field Refresh Status
- **App Route:** `GET /api/get_refresh_fields_status`
- **Census API:** `GET /api/v1/destinations/{destination_id}/objects/{object_full_name}/refresh_fields_status?refresh_key={refresh_key}`
- **Purpose:** Check if a field refresh operation has completed
- **Used By:** `FieldMapper` component via `useEntityRefresh` hook

---

### Sync Creation

#### 13. Create Sync
- **App Route:** `POST /api/create_sync`
- **Census API:** `POST /api/v1/syncs`
- **Purpose:** Create a new sync with the configured source, destination, operation, and field mappings
- **Used By:** `SyncWizard` component after user completes field mapping

---

### Census API Summary

**Total Census Endpoints Used:** 13

1. `GET /api/v1/sources/{source_id}/tables` - List tables
2. `GET /api/v1/destinations/{destination_id}/objects` - List objects
3. `GET /api/v1/destinations/{destination_id}/objects/{object_full_name}` - Get object details
4. `GET /api/v1/sources/{source_id}/tables/columns` - List columns (uses query params for table info)
5. `POST /api/v1/sources/{source_id}/refresh_tables` - Refresh tables
6. `POST /api/v1/sources/{source_id}/tables/refresh_columns` - Refresh columns (uses query params for table info)
7. `POST /api/v1/destinations/{destination_id}/refresh_objects` - Refresh objects
8. `POST /api/v1/destinations/{destination_id}/objects/{object_full_name}/refresh_fields` - Refresh fields
9. `GET /api/v1/sources/{source_id}/refresh_tables_status` - Check table refresh status
10. `GET /api/v1/sources/{source_id}/tables/refresh_columns_status` - Check column refresh status (uses query params for table info)
11. `GET /api/v1/destinations/{destination_id}/refresh_objects_status` - Check object refresh status
12. `GET /api/v1/destinations/{destination_id}/objects/{object_full_name}/refresh_fields_status` - Check field refresh status
13. `POST /api/v1/syncs` - Create sync

**All endpoints require:**
- `Authorization: Bearer {workspace_api_key}` header
- Proper URL encoding for path parameters with special characters
- Reference the OpenAPI spec for complete schemas and additional parameters

## Reusable Utilities

### RefreshButton Component (`components/SyncWizard/RefreshButton.js`)

A reusable button component for refresh operations.

**Props:**
- `onRefresh` - Function to call when clicked
- `isRefreshing` - Boolean indicating refresh state
- `label` - Optional label (defaults to "Refresh")

**Features:**
- Spinning icon during refresh
- Disabled state during refresh
- Consistent styling

**Usage:**
```jsx
<RefreshButton
  onRefresh={handleRefresh}
  isRefreshing={isRefreshing}
  label="Refresh Tables"
/>
```

### useEntityRefresh Hook (`hooks/useEntityRefresh.js`)

A reusable hook for managing entity refresh operations with intelligent status polling.

**Parameters:**
- `refreshFn` - Async function that performs the refresh (initiates the refresh job)
- `statusFn` - Optional async function that checks refresh status (polls until complete)
- `refetchFn` - Function to refetch data after refresh completes
- `autoRefresh` - Whether to auto-refresh when data is empty (default: true)
- `data` - The data array to check for emptiness
- `loading` - Whether initial data is loading
- `error` - Error state from initial fetch
- `pollInterval` - Interval in ms between status checks (default: 1000)
- `maxPolls` - Maximum number of status polls (default: 30)

**Returns:**
- `isRefreshing` - Boolean indicating refresh state
- `handleRefresh` - Function to manually trigger refresh

**How It Works:**
1. Calls `refreshFn()` to initiate the refresh job in Census
2. If `statusFn` is provided:
   - Polls the status endpoint every `pollInterval` milliseconds
   - Continues polling until status is "complete"/"succeeded" or "failed"/"error"
   - Max polls out after `maxPolls` attempts (default 30 seconds)
3. If no `statusFn`, falls back to waiting 2 seconds
4. Calls `refetchFn()` to get the updated data

**Usage:**
```jsx
const { isRefreshing, handleRefresh } = useEntityRefresh({
  refreshFn: async () => {
    const response = await fetch("/api/refresh_something", {
      method: "POST",
      headers: { ["authorization"]: `Bearer ${token}` },
      body: JSON.stringify({ id: entityId }),
    })
    if (!response.ok) throw new Error("Refresh failed")
  },
  statusFn: async () => {
    const response = await fetch("/api/get_refresh_status?id=${entityId}", {
      method: "GET",
      headers: { ["authorization"]: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error("Status check failed")
    return await response.json() // Must return { status: "complete" | "in_progress" | "failed" }
  },
  refetchFn: refetch,
  data: entities,
  loading,
  error,
  pollInterval: 1000, // Poll every 1 second
  maxPolls: 30, // Give up after 30 attempts
})
```

## Key Features

### 1. Searchable Table Selection

Uses the `cmdk` library (Command component) to provide a fast, keyboard-navigable search interface for tables.

```jsx
<Command>
  <CommandInput placeholder="Search tables..." />
  <CommandList>
    <CommandEmpty>No tables found.</CommandEmpty>
    {/* Grouped items */}
  </CommandList>
</Command>
```

### 2. Auto-Refresh Pattern

All entity lists (tables, objects, columns, fields) support auto-refresh when empty:

1. Component fetches data on mount
2. If data array is empty, automatically trigger refresh
3. Wait for refresh to complete
4. Refetch data
5. Display results

This ensures users always see data even if Census cache is stale.

### 3. Manual Refresh

Users can manually trigger refresh at any time using the refresh buttons. This is useful when:
- They've added new tables/columns/fields in their source/destination
- They want to ensure they're seeing the latest data
- Auto-refresh didn't capture recent changes

### 4. Centralized Refresh on Field Mapper

Both "Refresh Columns" and "Refresh Fields" buttons are on the FieldMapper component, allowing users to refresh both source and destination metadata from a single location without navigating back through the wizard.

### 5. Field Mapping Validation

The FieldMapper enforces several important rules:
- Primary identifier is required
- Only columns with `can_be_upsert_key: true` can be used as primary identifier
- Only fields with one of `can_be_upsert_key: true`, `can_be_insert_key: true`, `can_be_update_key: true` can be used as primary identifier
- Columns can be reused across mappings
- Fields cannot be reused (each field can only be mapped once)
- All mappings must be complete (both source and destination selected)

## Usage Example

### Integration in Parent Component

```jsx
import { useState } from "react"
import SyncWizard from "@components/SyncWizard/SyncWizard"

export default function MyComponent() {
  const [showWizard, setShowWizard] = useState(false)

  const handleSyncCreated = (newSync) => {
    console.log("Sync created:", newSync)
    // Refresh your syncs list
    refetchSyncs()
    setShowWizard(false)
  }

  return (
    <div>
      {showWizard ? (
        <SyncWizard
          sourceId="src_123"
          destinationId="dest_456"
          workspaceAccessToken="token_abc"
          onComplete={handleSyncCreated}
        />
      ) : (
        <button onClick={() => setShowWizard(true)}>
          Create Sync
        </button>
      )}
    </div>
  )
}
```

### Full Flow Example

1. User clicks "Create Sync" button
2. `SourceTableSelector` displays searchable list of tables
3. User searches for and selects "users" table
4. `DestinationObjectSelector` displays list of destination objects
5. User selects "Contact" object
6. `SyncBehaviorSelector` displays supported operations (update, upsert, insert)
7. User selects "upsert" operation
8. `FieldMapper` displays:
   - Primary identifier section with eligible columns/fields
   - Additional mappings section
   - Two refresh buttons
9. User maps:
   - Primary: `user_id` → `contact_id`
   - Additional: `email` → `email`, `name` → `full_name`
10. User clicks "Create Sync"
11. API call creates sync with no schedule, must be triggered manually
12. Wizard resets and calls `onComplete` callback

## Field Mapping Rules

### Primary Identifier Rules

**Operation-Based Filtering:**

The available fields for the primary identifier are filtered based on the sync operation selected in the previous step. Different operations have different requirements for which fields can be used as identifiers:

**Source Column Requirements:**
Must have `can_be_upsert_key: true`, regardless of the sync operation chosen.

**Destination Field Requirements (based on operation):**
- **Update or Delete operations**: Must have `can_be_update_key: true`
- **Insert operation**: Must have `can_be_insert_key: true`
- **Upsert, Mirror, or Append operations**: Must have `can_be_upsert_key: true`

**Why This Matters:**

The primary identifier is used to match records between source and destination. Different sync operations have different matching requirements:

- **Update/Delete**: Require existing records to be found and modified/removed, so only fields that can identify existing records are allowed
- **Insert**: Creates new records, so only fields suitable for new record insertion are allowed
- **Upsert**: Combination of insert and update, so fields must support both operations
- **Mirror/Append**: Similar to upsert, require fields that can handle record matching and creation

Census validates that both the source column and destination field are suitable for the selected operation (typically unique, indexed, or key fields).

**Implementation:**

```javascript
// Filter columns based on can_be_upsert_key
const upsertKeyColumns = columns?.filter((col) => col.can_be_upsert_key) || []

// Filter fields based on operation
const getPrimaryIdentifierFields = () => {
  return destinationObjectFields.filter((field) => {
    switch (selectedOperation) {
      case "update":
      case "delete":
        return field.can_be_update_key
      case "insert":
        return field.can_be_insert_key
      default:
        return field.can_be_upsert_key
    }
  })
}
```

### Additional Mapping Rules

**Source Columns:**
- All columns are available
- Can be reused in multiple mappings
- Example: Map `created_at` to both `created_date` and `last_modified`

**Destination Fields:**
- All fields are available initially
- Once a field is mapped, it's removed from other mapping dropdowns
- Cannot map multiple source columns to the same destination field

**Why This Matters:**
Census doesn't allow multiple source columns to map to the same destination field in a single sync. Each destination field can only receive data from one source column.

### Field Uniqueness Across All Mappings

**Critical Rule: Each destination field can only be used ONCE across ALL mappings**

This uniqueness constraint applies to:
- The primary identifier mapping
- All additional field mappings

**Implementation Details:**

1. **Primary Identifier Dropdown (Destination Field):**
   - Shows only upsert key fields as determined by the operation
   - **Excludes any fields already used in additional mappings**
   - If a field is selected in an additional mapping, it disappears from the primary identifier dropdown
   - Implemented via `getAvailableFieldsForPrimaryIdentifier()` helper

2. **Additional Mapping Dropdowns (Destination Field):**
   - Shows all destination fields initially
   - **Excludes the field used in the primary identifier**
   - Excludes fields used in other additional mappings
   - Each dropdown shows its own currently selected field plus unused fields
   - Implemented via `getAvailableFieldsForMapping(index)` helper

**User Experience:**
- As users select fields, those fields immediately become unavailable in other dropdowns
- If a user changes a selection, the previously selected field becomes available again
- This prevents validation errors when creating the sync
- Ensures compliance with Census API requirements

**Example:**
```
Primary Identifier: email_id → Email
Additional Mapping 1: first_name → FirstName
Additional Mapping 2: last_name → LastName

✅ Valid: All destination fields are unique
❌ Invalid: Additional Mapping 1 also tries to use "Email" field
❌ Invalid: Primary identifier tries to use "FirstName" field
```

### Required Field Support

**What Are Required Fields?**

Some destinations (like Salesforce, HubSpot, etc.) have fields marked as required by the destination's API. These fields must be included in every sync to that object, as the destination will reject records that don't include values for required fields.

**How Required Fields Work:**

1. **Detection**: Fields with `required_for_mapping: true` property in the API response are automatically detected
2. **Pre-population**: Required field mappings are automatically added to the Additional Mappings section when the FieldMapper loads
3. **User Action**: Users must select a source column for each required field (destination is pre-selected and locked)
4. **Protection**: Required field mappings cannot be removed by users

**Field Object Structure:**

```javascript
{
  full_name: "field_api_name",      // Unique identifier
  label: "Field Display Name",       // Human-readable name
  can_be_upsert_key: false,          // Cannot be used as primary identifier
  required_for_mapping: true        // Field is required by destination
}
```

**Implementation Details:**

1. **State Structure**:
   - Required mappings include `isRequired: true` flag
   - Pre-populated with destination field, empty source column
   - Example: `{ from: "", to: "LastName", isRequired: true }`

2. **Visual Indicators**:
   - Orange/amber border and background color (`border-orange-300 bg-orange-50/30`)
   - "REQUIRED FIELD" badge at top of mapping card
   - Red asterisk (*) next to Source Column and Destination Field labels
   - Orange-tinted input fields
   - No remove button for required mappings

3. **Validation**:
   - All required field mappings must have source column selected
   - Optional mappings can be empty or partial (as before)
   - Sync creation is blocked until all required fields are mapped
   - Validation in `isValid()` function specifically checks required mappings

4. **User Experience**:
   - Required mappings appear in Additional Mappings section
   - Required fields are listed first (if multiple)
   - Destination field dropdown is disabled (locked to required field)
   - Only source column selection is enabled
   - Section header shows "* Some fields are required by the destination" when required fields present

**Example Workflow:**

```
1. User selects Salesforce "Contact" object
2. Salesforce returns fields including:
   - Email (required_for_mapping: false, can_be_upsert_key: true)
   - LastName (required_for_mapping: true, can_be_upsert_key: false)
   - FirstName (required_for_mapping: false, can_be_upsert_key: false)

3. FieldMapper auto-creates mapping:
   - Additional Mapping 1: ??? → LastName (required, cannot remove)

4. User must:
   - Select primary identifier: user_email → Email
   - Select source for required field: last_name → LastName
   - Optionally add: first_name → FirstName

5. Create Sync button enables only when required field is mapped
```

**Code Implementation:**

```javascript
// Pre-populate required fields on mount
useEffect(() => {
  if (!destinationObjectFields?.length) return

  const requiredFields = destinationObjectFields.filter(field => field.required_for_mapping === true)
  if (requiredFields.length === 0) return

  if (additionalMappings.length === 0) {
    const requiredMappings = requiredFields.map(field => ({
      from: "",
      to: field.full_name,
      isRequired: true
    }))
    setAdditionalMappings(requiredMappings)
  }
}, [destinationObjectFields])

// Prevent removal of required mappings
const removeMapping = (index) => {
  const mapping = additionalMappings[index]
  if (mapping?.isRequired === true) {
    console.warn("Cannot remove required field mapping")
    return
  }
  setAdditionalMappings(additionalMappings.filter((_, i) => i !== index))
}

// Validate required fields are mapped
const isValid = () => {
  if (!primaryMapping.from || !primaryMapping.to) return false

  const hasIncompleteRequiredMappings = additionalMappings.some(
    m => m.isRequired === true && !m.from
  )
  if (hasIncompleteRequiredMappings) return false

  const optionalMappings = additionalMappings.filter(m => !m.isRequired)
  return optionalMappings.every(m => (m.from && m.to) || (!m.from && !m.to))
}
```

**Why This Matters:**

Destinations like CRM systems often have mandatory fields (e.g., Salesforce Account requires "Name", Contact requires "LastName"). Without mapping these fields, the sync would fail at runtime with API errors from the destination. Pre-populating and protecting these mappings:
- Prevents user errors and confusion
- Avoids failed sync creation attempts
- Makes requirements clear upfront
- Ensures data quality at the destination

**Edge Cases:**

1. **Required field is also upsert key**: User can use it as primary identifier OR additional mapping, but not both (field uniqueness rules still apply)
2. **Multiple required fields**: All are pre-populated in the order returned by API
3. **Required field refresh**: If fields are refreshed and new required fields appear, they're added to existing mappings
4. **Required field is unmapped**: Validation prevents sync creation until source column is selected
5. **No required fields**: Component behaves exactly as before, no changes to UX

### Mapping Format

Mappings are sent to the Census API in this format:

```javascript
{
  from: {
    data: "source_column_name",
    type: "column"
  },
  to: "destination_field_name",
  is_primary_identifier: true | false
}
```

## Refresh Pattern

### Why Refresh is Needed

Census caches metadata about sources and destinations for performance. This cache can become stale when:
- New tables/columns are added to the source
- New objects/fields are added to the destination
- Schema changes are made
- The connection is newly created

### Status Polling

Refresh operations can be slow, especially for sources with large schemas

**You cannot assume a fixed wait time will work.** What works for a small database will fail for an enterprise warehouse. This is why we poll Census's status endpoints - we let Census be authoritative about when the refresh is complete, rather than guessing at timing.

### Intelligent Refresh Flow with Status Polling

Our implementation uses **intelligent status polling** to ensure data is fully refreshed before displaying to the user.

1. **User Action or Auto-Trigger**
   - User clicks refresh button, or
   - Component detects empty data array

2. **Initiate Refresh Job**
   - POST to Census API refresh endpoint (e.g., `/api/v1/sources/{id}/refresh_tables`)
   - Census queues an asynchronous refresh job
   - API returns immediately - refresh happens in background

3. **Poll for Completion**
   - Begin polling the status endpoint (e.g., `/api/v1/sources/{id}/refresh_tables_status`)
   - Check status every 1 second (configurable via `pollInterval`)
   - Continue until status is:
     - `"completed"` → Proceed to refetch
     - `"error"` → Throw error and stop
   - Maximum of 30 polls (configurable via `maxPolls`)
   - If max polls reached, log warning and proceed anyway

4. **Refetch Data**
   - Once refresh is complete, call the list/fetch endpoint again
   - Census returns freshly updated data from cache

5. **Display Updated Data**
   - Update UI with refreshed data
   - User can now select from new items

### Status Response Format

Census status endpoints return responses like:
```json
{
  "status": "completed",  // or "processing", "error"
  "message": "Optional error message if failed"
}
```

### Configuration Options

```javascript
useEntityRefresh({
  // ... other params
  pollInterval: 1000,  // Poll every 1 second (1000ms)
  maxPolls: 30,        // Default: 30 attempts (30 seconds total)
})
```

**Default Configuration:**
- `pollInterval: 1000` (1 second) - Good balance between responsiveness and API load
- `maxPolls: 30` (30 seconds total) - Handles most small-to-medium cases

**Recommended for Large Warehouses:**
```javascript
useEntityRefresh({
  // ... other params
  pollInterval: 2000,  // Poll every 2 seconds (reduce API calls)
  maxPolls: 180,       // 6 minutes total (180 * 2s = 360s)
})
```

### Best Practices

- **Auto-refresh**: Always auto-refresh when data is empty to improve UX
- **Manual refresh**: Always provide a manual refresh button for power users
- **Poll interval**: 1-2 seconds is a good balance between responsiveness and API load
- **Max polls**:
  - **30 seconds minimum** for basic cases
  - **3-5 minutes recommended** for production use with unknown warehouse sizes
  - **Never assume a short timeout will work** - large warehouses can take several minutes
- **Error handling**: Show clear error messages if refresh fails or times out
- **Loading states**: Always show loading indicator with status text like "Refreshing tables... this may take a few minutes for large warehouses"
- **User communication**: For table refresh operations, consider showing a message that refresh time depends on warehouse size
- **Trust Census**: Let Census be authoritative - poll until it says it's done rather than guessing at timeouts

### Refresh Components Architecture

```
useEntityRefresh Hook
├── Auto-refresh on empty data (optional)
├── Manual refresh trigger
├── Loading state management
├── Initiates refresh job (refreshFn)
├── Polls for completion (statusFn)
│   ├── Checks status every pollInterval
│   ├── Max attempts: maxPolls
│   └── Handles success/failure/timeout
└── Refetches data when complete (refetchFn)

RefreshButton Component
├── Consistent UI
├── Loading/disabled state
└── Spinning icon during refresh
```

## Future Enhancements

Potential improvements and additional functionality to consider (always check OpenAPI spec for available API capabilities):

### Implemented Features ✅

1. **~~Polling for Refresh Status~~** ✅ **IMPLEMENTED**
   - ✅ Poll Census API for refresh job status
   - ✅ Show progress indicator during refresh
   - ✅ Automatically refetch when complete
   - ✅ Uses status endpoints from OpenAPI spec

2. **~~Operation-Based Primary Identifier Filtering~~** ✅ **IMPLEMENTED**
   - ✅ Filter available fields based on selected sync operation
   - ✅ Different operations (update/insert/upsert) show appropriate fields
   - ✅ Uses `can_be_update_key`, `can_be_insert_key`, `can_be_upsert_key` properties

3. **~~Required Field Support~~** ✅ **IMPLEMENTED**
   - ✅ Automatically detect and pre-populate required fields
   - ✅ Prevent removal of required field mappings
   - ✅ Visual indicators for required fields
   - ✅ Uses `required_for_mapping` property from API

### Source & Destination Selection

1. **Support for Multiple Source Types**
   - Currently only supports syncing from tables
   - Add support for:
     - Datasets (**OpenAPI**: `GET /api/v1/datasets` | [Web reference](https://developers.getcensus.com/api-reference/datasets/list-datasets))
     - Segments (**OpenAPI**: `GET /api/v1/segments` | [Web reference](https://developers.getcensus.com/api-reference/segments/list-segments))
     - Cohorts (**OpenAPI**: `GET /api/v1/segments` | [Web reference](https://developers.getcensus.com/api-reference/segments/list-segments))

2. **Dynamic Destination Connection Selection**
   - Currently destination is hardcoded to specific connection
   - Add UI to let users select from available destination connections
   - Fetch list of destinations via Census API
   - **OpenAPI**: `GET /api/v1/destinations` | [Web reference](https://developers.getcensus.com/api-reference/destinations/list-destinations)

### Field Mapping Enhancements

1. **Smart Mapping Suggestions**
   - Auto-suggest mappings based on field name similarity
   - Remember common mappings from previous syncs
   - "Map All" button for matching field names

2. **Custom Field Mapping**
   - Support mapping to custom fields when the destination supports it, specified by the `allow_custom_fields: true` flag
   - Let users specify custom field name and type
   - **OpenAPI**: Response field `allow_custom_fields` in `GET /api/v1/destinations/{destination_id}/objects/{object_full_name}` | [Web reference](https://developers.getcensus.com/api-reference/destinations/fetch-destination-object#response-data-allow-custom-fields)
   - [Product Docs reference](https://docs.getcensus.com/syncs/overview#creating-new-fields-on-your-destination-object)

3. **Sync All Properties**
   - Add "Sync All Properties" option for destinations with `allow_custom_fields: true`
   - Automatically map all available source columns to destination
   - Skip manual field mapping step
   - **OpenAPI**: Response field `allow_custom_fields` in `GET /api/v1/destinations/{destination_id}/objects/{object_full_name}` | [Web reference](https://developers.getcensus.com/api-reference/destinations/fetch-destination-object#response-data-allow-custom-fields)
   - [Product Docs reference](https://docs.getcensus.com/syncs/overview#creating-new-fields-on-your-destination-object)

4. **Field Mapping Order**
    - Support mapping order selection when the destinatin support it, specified by the `supports_field_ordering: true` flag
    - Options: Alphabetical or Mapping Order
    - **OpenAPI**: Response field `supports_field_ordering` in `GET /api/v1/destinations/{destination_id}/objects/{object_full_name}` | [Web reference](https://developers.getcensus.com/api-reference/destinations/fetch-destination-object#response-data-supports-field-ordering)

5. **Skip Primary Identifier for Certain Destinations**
    - Some destinations (Google Sheets) don't require primary identifier
    - Conditionally show/hide primary identifier step based on destination requirements

6. **Alternative Mapping Sources**
    - Currently only supports mapping from columns (`type: "column"`)
    - Add support for all other types supported in the API:
      - **Constant values**: Map a hardcoded value to a destination field (`type: "constant_value"`)
      - **Sync metadata**: Map Census sync metadata (sync time, sync ID, etc.) (`type: "sync_metadata"`)
      - **Liquid templates**: Use Liquid templating language for dynamic values (`type: "liquid_template"`)
    - **OpenAPI**: Request field `mappings.from` in `POST /api/v1/syncs` | [Web reference](https://developers.getcensus.com/api-reference/syncs/create-a-new-sync#body-mappings-from)
    - [Product Docs reference](https://docs.getcensus.com/syncs/overview#field-mappings)

7. **Preserve Values Configuration**
    - Add UI to set `preserve_values` on individual field mappings
    - Only show when field has `preserve_values_supported: true` as specified in the API response
    - Checkbox or toggle to enable preserving existing values in destination
    - When enabled, Census won't overwrite existing destination values with null/empty
    - Common for fields like "Do Not Contact" that should never be blanked out
    - **OpenAPI**: Response field `fields[].preserve_values_supported` in `GET /api/v1/destinations/{destination_id}/objects/{object_full_name}` | [Web reference](https://developers.getcensus.com/api-reference/destinations/fetch-destination-object#response-data-fields-preserve-values-supported)
    - [Product Docs reference](https://docs.getcensus.com/syncs/overview#conditional-field-mappings)

8. **Sync Null Values Configuration**
    - Add UI to set `sync_null_values` on individual field mappings (defaults to true)
    - Only show when destination supports this configuration
    - Checkbox or toggle to control whether null values are synced
    - When disabled, null values in source won't be sent to the destination
    - Useful for avoiding overwriting existing data with nulls
    - Check destination capabilities and field-level support
    - [Product Docs reference](https://docs.getcensus.com/syncs/overview#conditional-field-mappings)

### Sync Configuration Options

1. **Advanced Configuration UI**
    - Surface advanced configuration for selected destination object
    - Let users set advanced config settings specific to destination
    - Useful for settings like file format in S3 syncs, enabling bulk lookup in the Salesforce API, etc
    - **OpenAPI**: Request field `advanced_configuration` in `POST /api/v1/syncs` | [Web reference](https://developers.getcensus.com/api-reference/syncs/create-a-new-sync#body-advanced-configuration)

2. **Audience Sync Support**
    - Add UI to set the audience mapping for audience syncs
    - [Product Docs reference](https://docs.getcensus.com/syncs/audience-syncs)

3. **File System Destination Syncs**
    - UI for users to type in file path for destinations like [SFTP](https://docs.getcensus.com/destinations/available-destinations/sftp) or [S3](https://docs.getcensus.com/sources/sources/s3)

4. **HTTP Request Destinations Syncs**
    - UI to configure endpoint URL, headers, request format for [HTTP Request destination](https://docs.getcensus.com/destinations/available-destinations/http-request)

5. **Slack Sync Customization**
    - WYSIWYG editor for customizing Slack messages
    - Template variables for dynamic content
    - [Product Docs reference](https://docs.getcensus.com/destinations/available-destinations/slack#setup-your-message)

6. **Custom Object Support**
    - UI to support creating custom objects on the fly for Salesforce, Marketing Cloud, Google Sheets, Snowflake
    - If a destination has `supports_custom_objects: true`, it supports custom object creation via the custom object API
    - **OpenAPI**: `POST /api/v1/destinations/{destination_id}/objects` | [Web reference](https://developers.getcensus.com/api-reference/destinations/create-a-new-destination-object)

7. **High Water Mark Tracking**
    - For Append operation, let users optionally select high water mark column
    - Show column selector for timestamp columns
    - **OpenAPI**: Request field `high_water_mark_attribute` in `POST /api/v1/syncs` | [Web reference](https://developers.getcensus.com/api-reference/syncs/create-a-new-sync#body-high-water-mark-attribute)
    - [Product Docs reference](https://docs.getcensus.com/syncs/structuring-data/events#using-timestamp-to-identify-new-records)

8. **First Sync Behavior**
    - For Append syncs, let users choose:
      - Backfill all records (sync everything on first run)
      - Skip current records (only sync future records)
    - Add radio button selection during sync creation
    - **OpenAPI**: Request field `historical_sync_operation` in `POST /api/v1/syncs` | [Web reference](https://developers.getcensus.com/api-reference/syncs/create-a-new-sync#body-historical-sync-operation)
    - [Product Docs reference](https://docs.getcensus.com/syncs/structuring-data/events#backfill-or-just-look-forward)

9. **Sync Triggers**
    - Currently hardcoded to be manually triggered
    - Add support for:
      - Custom schedule (cron expressions, intervals)
      - Fivetran webhook trigger
      - dbt webhook trigger
      - After completion of another sync (dependency chain)
    - **OpenAPI**: Request field `mode.triggers` in `POST /api/v1/syncs` | [Web reference](https://developers.getcensus.com/api-reference/syncs/create-a-new-sync#body-mode-triggers)
    - [Product Docs reference](https://docs.getcensus.com/syncs/triggering-syncs)

10. **Sync Naming**
    - Let users name their syncs
    - Add name input field during sync creation
    - Default to auto-generated name if not provided

### Sync Management

1. **Edit Existing Sync**
    - UI to modify existing sync configuration
    - Load sync details into wizard
    - Update sync via Census API
    - **OpenAPI**: `PATCH /api/v1/syncs/{sync_id}` | [Web reference](https://developers.getcensus.com/api-reference/syncs/update-a-sync)

2. **Validation Preview**
    - Show validation errors before attempting sync creation
    - **OpenAPI**: Request field `validate_only` in `POST /api/v1/syncs` | [Web reference](https://developers.getcensus.com/api-reference/syncs/create-a-new-sync#body-validate-only)

### Implementation Notes

When implementing any of these enhancements:
- Always refer to the OpenAPI spec first for API capabilities
- Check destination-specific fields like `supports_field_ordering`, `allow_custom_fields`, `supports_custom_objects` to understand destination capabilities

## Conclusion

The SyncWizard provides a minimal solution for creating Census syncs through a guided UI. The architecture is modular, the refresh pattern is reusable, and the validation ensures data integrity. Use this guide as a reference for understanding, maintaining, or extending the SyncWizard functionality.

**Remember:** When making any changes or additions involving the Census API, always consult the OpenAPI specification at https://developers.getcensus.com/openapi/compiled/workspace_management.yaml first. This ensures you're using the correct endpoints, schemas, and parameters.
