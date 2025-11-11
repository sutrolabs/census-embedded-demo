# SyncWizard Implementation Guide

This document explains the SyncWizard implementation in this project, which provides a step-by-step interface for users to create data syncs between sources and destinations using the Census API.

## ⚠️ Important: Census API Reference

**When working with the Census API, always refer to the OpenAPI specification:**

🔗 **https://developers.getcensus.com/openapi/compiled/workspace_management.yaml**

Do NOT use the developer documentation website as the primary reference. The OpenAPI spec is the source of truth for:
- Endpoint paths and methods
- Request/response schemas
- Required and optional parameters
- Field types and validation rules

This is critical for ensuring API calls are correctly formatted and all available options are utilized.

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Components](#components)
4. [API Routes](#api-routes)
5. [Reusable Utilities](#reusable-utilities)
6. [Key Features](#key-features)
7. [Usage Example](#usage-example)
8. [Field Mapping Rules](#field-mapping-rules)
9. [Refresh Pattern](#refresh-pattern)

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

## API Routes

All API routes are in `pages/api/` and follow this pattern:
1. Validate request method and parameters
2. Get workspace access token from request
3. Call Census API (refer to OpenAPI spec for exact endpoints/schemas)
4. Return formatted response

**Important:** All Census API endpoints and schemas referenced here are documented in the OpenAPI specification at https://developers.getcensus.com/openapi/compiled/workspace_management.yaml

### Data Fetching Routes

#### `GET /api/list_source_tables`
Lists all tables for a source.

**Query Params:**
- `sourceId` - Census source ID

**Response:** Array of table objects with `table_name`, `table_schema`, `table_catalog`

#### `GET /api/list_destination_objects`
Lists all objects for a destination.

**Query Params:**
- `destinationId` - Census destination ID

**Response:** Array of object objects with `full_name`, `label`

#### `GET /api/fetch_destination_object`
Fetches detailed information about a destination object.

**Query Params:**
- `destinationId` - Census destination ID
- `objectFullName` - Full name of the object

**Response:** Object with `supported_operations`, `fields`, etc.

#### `GET /api/list_table_columns`
Lists columns for a specific table.

**Query Params:**
- `sourceId` - Census source ID
- `schemaName` - Table schema name
- `tableName` - Table name
- `catalogName` - Table catalog name

**Response:** Array of column objects with `name`, `can_be_upsert_key`, etc.

### Refresh Routes

#### `POST /api/refresh_source_tables`
Triggers a refresh of tables for a source.

**Body:**
```json
{
  "sourceId": "src_123"
}
```

**Census API Endpoint:** `POST /api/v1/sources/{source_id}/refresh_tables`

#### `POST /api/refresh_table_columns`
Triggers a refresh of columns for a specific table.

**Body:**
```json
{
  "sourceId": "src_123",
  "tableCatalog": "catalog_name",
  "tableSchema": "schema_name",
  "tableName": "table_name"
}
```

**Census API Endpoint:** `POST /api/v1/sources/{source_id}/tables/{table_catalog}.{table_schema}.{table_name}/columns/refresh`

#### `POST /api/refresh_destination_objects`
Triggers a refresh of objects for a destination.

**Body:**
```json
{
  "destinationId": "dest_123"
}
```

**Census API Endpoint:** `POST /api/v1/destinations/{destination_id}/objects/refresh`

#### `POST /api/refresh_destination_fields`
Triggers a refresh of fields for a specific destination object.

**Body:**
```json
{
  "destinationId": "dest_123",
  "objectFullName": "Object.FullName"
}
```

**Census API Endpoint:** `POST /api/v1/destinations/{destination_id}/objects/{object_full_name}/fields/refresh`

### Refresh Status Routes

These routes poll Census API to check if a refresh operation has completed.

#### `GET /api/get_refresh_tables_status`
Checks the status of a table refresh operation.

**Query Params:**
- `sourceId` - Census source ID

**Response:** Status object with `status` field (e.g., "complete", "in_progress", "failed")

**Census API Endpoint:** `GET /api/v1/sources/{source_id}/refresh_tables_status`

#### `GET /api/get_refresh_columns_status`
Checks the status of a column refresh operation.

**Query Params:**
- `sourceId` - Census source ID

**Response:** Status object with `status` field

**Census API Endpoint:** `GET /api/v1/sources/{source_id}/tables/refresh_columns_status`

#### `GET /api/get_refresh_objects_status`
Checks the status of an object refresh operation.

**Query Params:**
- `destinationId` - Census destination ID

**Response:** Status object with `status` field

**Census API Endpoint:** `GET /api/v1/destinations/{destination_id}/refresh_objects_status`

#### `GET /api/get_refresh_fields_status`
Checks the status of a field refresh operation.

**Query Params:**
- `destinationId` - Census destination ID
- `objectFullName` - Full name of the object

**Response:** Status object with `status` field

**Census API Endpoint:** `GET /api/v1/destinations/{destination_id}/objects/{object_full_name}/refresh_fields_status`

### Sync Creation Route

#### `POST /api/create_sync`
Creates a new sync with the configured mappings.

**Body:**
```json
{
  "sourceId": "src_123",
  "sourceTableName": "table_name",
  "sourceTableCatalog": "catalog_name",
  "sourceTableSchema": "schema_name",
  "destinationId": "dest_123",
  "destinationObject": "Object.FullName",
  "operation": "upsert",
  "mappings": [
    {
      "from": { "data": "column_name", "type": "column" },
      "to": "field_name",
      "is_primary_identifier": true
    }
  ]
}
```

**Response:** Created sync object

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
- Only fields with `can_be_upsert_key: true` can be used as primary identifier
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
11. API call creates sync with continuous schedule
12. Wizard resets and calls `onComplete` callback

## Field Mapping Rules

### Primary Identifier Rules

**Source Column Requirements:**
- Must have `can_be_upsert_key: true`
- Only these columns appear in primary identifier dropdown

**Destination Field Requirements:**
- Must have `can_be_upsert_key: true`
- Only these fields appear in primary identifier dropdown

**Why This Matters:**
The primary identifier is used to match records between source and destination. Census validates that both the source column and destination field are suitable for this purpose (typically unique, indexed, or key fields).

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

### Why Status Polling is Critical

**Refresh operations can be extremely slow, especially for sources with large schemas:**
- Small warehouses (< 50 tables): 2-10 seconds
- Medium warehouses (50-500 tables): 10-60 seconds
- **Large warehouses (500+ tables): Several minutes or more**

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
     - `"complete"` or `"succeeded"` → Proceed to refetch
     - `"failed"` or `"error"` → Throw error and stop
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
  "status": "complete",  // or "in_progress", "failed", "error", "succeeded"
  "message": "Optional error message if failed"
}
```

### Why Polling is Better Than Fixed Wait

**Old Approach (Fixed Wait Time):**
- ❌ Wastes time if refresh completes quickly (< 2s)
- ❌ **Fails catastrophically on large warehouses** - assumes 2s or even 20s is enough
- ❌ No feedback on refresh progress
- ❌ Can't detect failures
- ❌ Forces you to guess at appropriate wait times

**New Approach (Status Polling - Let Census Be Authoritative):**
- ✅ Completes as soon as refresh is done (no wasted time)
- ✅ **Waits as long as Census needs** - whether 5 seconds or 5 minutes
- ✅ Provides real-time status
- ✅ Detects and reports failures immediately
- ✅ **Essential for production use with real-world data warehouses**
- ✅ Trust Census to tell us when it's done, rather than guessing

**Critical Point:** For sources with thousands of tables, refreshing can take several minutes. There's no "safe" fixed wait time that works for all cases. Status polling is not optional - it's the only reliable approach.

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

**Real-World Timing Examples:**
- Small warehouse (< 50 tables): 5-15 seconds
- Medium warehouse (50-500 tables): 30-90 seconds
- **Large warehouse (500-5000 tables): 2-5 minutes**
- **Enterprise warehouse (5000+ tables): 5+ minutes**

**Important:** Don't set `maxPolls` too low. It's better to let users wait while showing a progress indicator than to time out prematurely and show stale data. Census will tell you when it's done - trust the status endpoint.

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

### Fallback Behavior

If `statusFn` is not provided (for backward compatibility or non-Census APIs), the hook falls back to the old behavior:
- Waits 2 seconds
- Assumes refresh is complete
- Refetches data

**Warning:** This fallback is only suitable for testing or non-Census APIs. For production Census integrations, always provide `statusFn` to poll for completion. The 2-second fallback is **not reliable** for real-world data warehouses and will often result in showing stale data because the refresh hasn't actually completed yet.

## Common Patterns

### 1. Adding a New Step

To add a new step to the wizard:

1. Add new step constant:
```javascript
const STEPS = {
  // ... existing steps
  MY_NEW_STEP: "MY_NEW_STEP",
}
```

2. Add state for new step data:
```javascript
const [myStepData, setMyStepData] = useState(null)
```

3. Add handler:
```javascript
const handleMyStepComplete = (data) => {
  setMyStepData(data)
  setCurrentStep(STEPS.NEXT_STEP)
}
```

4. Add conditional render:
```javascript
{currentStep === STEPS.MY_NEW_STEP && (
  <MyStepComponent
    onComplete={handleMyStepComplete}
    onBack={() => setCurrentStep(STEPS.PREVIOUS_STEP)}
  />
)}
```

### 2. Adding Entity Refresh to New Component

```javascript
import { useBasicFetch } from "@utils/fetch"
import { useEntityRefresh } from "@hooks/useEntityRefresh"
import RefreshButton from "@components/SyncWizard/RefreshButton"

// In your component:
const { loading, error, data, refetch } = useBasicFetch(fetchFn)

const { isRefreshing, handleRefresh } = useEntityRefresh({
  refreshFn: async () => {
    // Initiate the refresh job
    const response = await fetch("/api/refresh_endpoint", {
      method: "POST",
      headers: { ["authorization"]: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    if (!response.ok) throw new Error("Refresh failed")
  },
  statusFn: async () => {
    // Poll for completion
    const response = await fetch(`/api/get_refresh_status?id=${id}`, {
      method: "GET",
      headers: { ["authorization"]: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error("Status check failed")
    return await response.json() // Must return { status: "complete" | "in_progress" | ... }
  },
  refetchFn: refetch,
  data,
  loading,
  error,
})

// In your JSX:
<RefreshButton onRefresh={handleRefresh} isRefreshing={isRefreshing} />
```

### 3. Creating New Refresh API Routes

**Always check the OpenAPI spec first** to verify the exact endpoint paths, methods, and required parameters.

**Refresh Endpoint (Initiate):**
```javascript
import fetch from "node-fetch"
import pino from "pino"
import { getWorkspaceAccessToken } from "@utils/auth"
import { checkStatus } from "@utils/status"
import { censusBaseUrl } from "@utils/url"

const logger = pino({ name: __filename })

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({})
    return
  }

  const { entityId } = req.body
  if (!entityId) {
    res.status(400).json({ error: "entityId is required" })
    return
  }

  const workspaceApiKey = getWorkspaceAccessToken(req)

  // Verify this endpoint path in the OpenAPI spec before using
  const apiResponse = await fetch(
    `${censusBaseUrl}/api/v1/entities/${entityId}/refresh`,
    {
      method: "POST",
      headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
    }
  )
  await checkStatus(apiResponse, 200)
  const result = await apiResponse.json()
  logger.info([result])

  res.status(200).json(result)
}
```

**Status Endpoint (Poll):**
```javascript
import fetch from "node-fetch"
import pino from "pino"
import { getWorkspaceAccessToken } from "@utils/auth"
import { setCacheControlHeaders } from "@utils/cacheControlHeaders"
import { getSearchParams } from "@utils/request"
import { checkStatus } from "@utils/status"
import { censusBaseUrl } from "@utils/url"

const logger = pino({ name: __filename })

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({})
    return
  }

  setCacheControlHeaders(res)

  const { entityId } = getSearchParams(req)
  if (!entityId) {
    res.status(400).json({ error: "entityId is required" })
    return
  }

  const workspaceApiKey = getWorkspaceAccessToken(req)

  // Verify this endpoint path in the OpenAPI spec before using
  const apiResponse = await fetch(
    `${censusBaseUrl}/api/v1/entities/${entityId}/refresh_status`,
    {
      method: "GET",
      headers: { ["authorization"]: `Bearer ${workspaceApiKey}` },
    }
  )
  await checkStatus(apiResponse, 200)
  const result = await apiResponse.json()
  logger.info([result])

  res.status(200).json(result)
}
```

## Troubleshooting

### Refresh Not Working

**Problem:** Refresh button clicks but data doesn't update

**Solutions:**
1. Check status polling - verify status endpoint is returning expected response format
2. Increase `maxPolls` if refresh takes longer than 30 seconds
3. Check browser console for status polling errors
4. Verify Census API is actually refreshing (check network tab)
5. Ensure refetch function is being called
6. Check that status response has `status` field with expected values

**Problem:** Refresh times out after 30 seconds

**Solutions:**
1. **This is expected for large warehouses** - increase `maxPolls` significantly
2. For production use, set `maxPolls: 180` or higher (3-6 minutes)
3. Consider dynamic timeout based on source type: warehouses need longer than SaaS apps
4. Show user-friendly message: "Large warehouses can take several minutes to refresh"
5. Check Census logs only if timeout exceeds 10 minutes (may indicate actual failure)
6. **Remember:** It's better to wait for Census to confirm completion than to time out early and show stale data

**Problem:** Refresh seems to hang indefinitely

**Solutions:**
1. Check browser network tab to ensure status polling requests are being made
2. Verify status endpoint is returning proper response format with `status` field
3. Check if Census is actually processing the refresh (may be queued)
4. For extremely large warehouses (10,000+ tables), refresh can legitimately take 10+ minutes
5. Consider implementing a "Cancel" button that stops polling but warns user data may be stale

### Empty Dropdowns

**Problem:** No options appear in field/column dropdowns

**Solutions:**
1. Check if auto-refresh is triggering
2. Manually click refresh button
3. Verify API is returning data in expected format
4. Check `can_be_upsert_key` filtering isn't too restrictive

### Validation Errors

**Problem:** "Create Sync" button stays disabled

**Solutions:**
1. Ensure primary identifier is set
2. Check all additional mappings are complete or remove empty ones
3. Verify at least one mapping exists
4. Check console for validation logic errors

## Future Enhancements

Potential improvements to consider (always check OpenAPI spec for available API capabilities):

1. **~~Polling for Refresh Status~~** ✅ **IMPLEMENTED**
   - ✅ Poll Census API for refresh job status
   - ✅ Show progress indicator during refresh
   - ✅ Automatically refetch when complete
   - Uses status endpoints from OpenAPI spec

2. **Smart Mapping Suggestions**
   - Auto-suggest mappings based on field name similarity
   - Remember common mappings from previous syncs

3. **Bulk Mapping**
   - Allow users to map all matching field names at once
   - Provide "Map All" button

4. **Validation Preview**
   - Show validation errors before attempting sync creation
   - Preview what data will sync
   - Use Census validation endpoints if available

5. **Schedule Configuration**
   - Allow users to configure sync schedule
   - Currently hardcoded to "continuous"
   - Check OpenAPI spec for available schedule options

6. **Advanced Options**
   - Filter conditions
   - Data transformations
   - Field-level sync controls
   - Refer to sync creation schema in OpenAPI spec for all available options

## Conclusion

The SyncWizard provides a complete, production-ready solution for creating Census syncs through a guided UI. The architecture is modular, the refresh pattern is reusable, and the validation ensures data integrity. Use this guide as a reference for understanding, maintaining, or extending the SyncWizard functionality.

**Key Takeaways:**

1. **Always use status polling for refresh operations** - Never assume fixed wait times. Let Census be authoritative about when refreshes are complete.

2. **Warehouse size matters** - What works for a 10-table database will fail for a 10,000-table warehouse. Refresh operations can take several minutes for large sources.

3. **Trust Census** - The status endpoints exist for a reason. Poll them until Census says the refresh is complete, rather than guessing at appropriate timeouts.

4. **Configure for your use case** - Default `maxPolls: 30` is a starting point. Production applications should use higher values (180+) to handle enterprise warehouses.

**Remember:** When making any changes or additions involving the Census API, always consult the OpenAPI specification at https://developers.getcensus.com/openapi/compiled/workspace_management.yaml first. This ensures you're using the correct endpoints, schemas, and parameters.
