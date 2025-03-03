import Head from "next/head"
import { useState, useEffect } from "react"

import Button from "@components/Button/Button/Button"
import { SubtleButton } from "@components/Button/SubtleButton/SubtleButton"
import { CentralDataImportIcon } from "@components/Icons/DataImport"
import { ConnectionLogo } from "@components/Logo/ConnectionLogo"
import Header from "@components/Structural/Header/Header"
import { SyncStatus } from "@components/SyncStatus"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/Table/Table"
import NewSourceDrawer from "@components/Workflows/NewSourceFlow/NewSourceDrawer"
import { b2bCustomerData } from "@data/b2b-customer-data"
import { getSourceMetadataFromConnectionId } from "@hooks/useSyncSourceInformation"
import { SourceFlowProvider, useSourceFlow } from "@providers/SourceFlowProvider"

export default function ImportDataset({
  workspaceAccessToken,
  dd,
  sources,
  setSources,
  destinations,
  refetchSyncs,
  refetchSources,
  sourceConnectLinks,
  refetchSourceConnectLinks,
  sourceEmbedLinks,
  syncManagementLinks,
  refetchSyncManagementLinks,
  syncs,
  setSyncs,
  runsLoading,
  runs,
  embedMode,
  devMode,
}) {
  const [showSidebar, setShowSidebar] = useState(false)
  const [selectedSourceId, setSelectedSourceId] = useState(null)
  const [availableSourceTypes, setAvailableSourceTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const editSyncLinkQueryParams = "&edit_mode=true"

  const handleSourceConnectionComplete = (result) => {
    // Handle the completed source connection
    refetchSources()
    setShowSidebar(false)
  }

  // Remove this line - we'll use the hook inside the component where the provider is available
  // const { openToSource } = useSourceFlow()

  // Fetch available sources when the component mounts
  useEffect(() => {
    const fetchSourceTypes = async () => {
      try {
        const response = await fetch("/api/list_source_types", {
          headers: {
            ["authorization"]: `Bearer ${workspaceAccessToken}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch sources")
        }
        const data = await response.json()
        setAvailableSourceTypes(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSourceTypes()
  }, [workspaceAccessToken])

  useEffect(() => {
    const fetchSyncs = async () => {
      try {
        const response = await fetch("/api/list_syncs", {
          headers: {
            ["authorization"]: `Bearer ${workspaceAccessToken}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch syncs")
        }
        const data = await response.json()
        setSyncs(data)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchSyncs()
  }, [workspaceAccessToken, setSyncs])

  const configureSync = async (sync) => {
    try {
      const response = await fetch("/api/create_edit_sync_management_link", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
        body: JSON.stringify({
          syncId: sync.id,
        }),
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const data = await response.json()
      setEditSyncLink(data.uri + editSyncLinkQueryParams)
      setSelectedSync(sync)
    } catch (error) {}
  }

  return (
    <>
      <Head>
        <title>Census Embedded Demo App</title>
      </Head>
      <Header title="Data Management" />
      <div className="flex flex-row items-center justify-between border-b border-neutral-100 px-8 py-3">
        Customers{" "}
        <SubtleButton
          onClick={() => setShowSidebar(!showSidebar)}
          active={showSidebar}
          icon={
            <CentralDataImportIcon
              className={`h-2.5 transition-all duration-300 ${
                showSidebar ? "rotate-45 fill-violet-50" : "fill-violet-500"
              }`}
            />
          }
          syncs={syncs}
        />
      </div>

      <div className="flex h-full w-full flex-row items-stretch overflow-hidden">
        <Table className>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] pl-6">Company</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead className="w-[150px] truncate text-right">Contract Value</TableHead>
              <TableHead>Last Logged In</TableHead>
              <TableHead>Contract Signed</TableHead>
              <TableHead className="w-[100px] truncate">Campaigns Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {b2bCustomerData.map((customer) => (
              <TableRow key={customer.customer_id}>
                <TableCell className="truncate pl-6">{customer.company_name}</TableCell>
                <TableCell className="max-w-[150px] truncate">{customer.hq_city}</TableCell>
                <TableCell className="max-w-[200px] truncate">{customer.industry}</TableCell>
                <TableCell className="text-right">{customer.contract_value.toLocaleString()}</TableCell>
                <TableCell>{new Date(customer.last_logged_in).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(customer.contract_signed).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">{customer.campaigns_received}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {showSidebar && (
          <div className="flex h-full w-2/3 max-w-[800px]  flex-col gap-4 overflow-hidden border-l border-neutral-100 bg-white p-6 shadow-md transition duration-100">
            <SourceFlowProvider
              workspaceAccessToken={workspaceAccessToken}
              sourceConnectLinks={sourceConnectLinks}
              refetchSourceConnectLinks={refetchSourceConnectLinks}
              syncManagementLinks={syncManagementLinks}
              refetchSyncManagementLinks={refetchSyncManagementLinks}
              syncs={syncs}
              setSyncs={setSyncs}
              refetchSyncs={refetchSyncs}
              runsLoading={runsLoading}
              runs={runs}
              devMode={devMode}
              embedMode={embedMode}
              sources={sources}
              availableSourceTypes={availableSourceTypes}
            >
              {syncs.length > 0 ? (
                <SyncsList
                  syncs={syncs}
                  sources={sources}
                  runsLoading={runsLoading}
                  runs={runs}
                  workspaceAccessToken={workspaceAccessToken}
                  refetchSyncs={refetchSyncs}
                  setSyncs={setSyncs}
                />
              ) : (
                <>
                  <div className="flex rounded-lg bg-neutral-100 p-6 text-lg">
                    No connections importing data. Add a new source below to add your data to Acme.
                  </div>
                </>
              )}
              <NewSourceDrawer />
            </SourceFlowProvider>
          </div>
        )}
      </div>
    </>
  )
}

// Create a new component that will use the useSourceFlow hook
function SyncsList({ syncs, sources, runsLoading, runs, workspaceAccessToken, refetchSyncs, setSyncs }) {
  // Now we can safely use the useSourceFlow hook here because this component is rendered inside the SourceFlowProvider
  const { openToSync } = useSourceFlow()

  // Function to run a sync
  const runSync = async (sync) => {
    try {
      const response = await fetch("/api/trigger_sync_run", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
        body: JSON.stringify({
          syncId: sync.id,
        }),
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      setSyncs((syncs) =>
        syncs.map((item) => (item.id === sync.id ? { ...sync, updated_at: new Date().toISOString() } : item)),
      )
      await refetchSyncs()
    } catch (error) {}
  }

  // Function to toggle sync pause state
  const toggleSync = async (sync) => {
    try {
      const response = await fetch("/api/set_sync_paused", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
        body: JSON.stringify({
          id: sync.id,
          paused: !sync.paused,
        }),
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const data = await response.json()
      setSyncs((syncs) => syncs.map((item) => (item.id === sync.id ? data : item)))
      await refetchSyncs()
    } catch (error) {}
  }

  if (!syncs || syncs.length === 0) {
    return null
  }

  return (
    <>
      <h2 className="text-base font-medium">Existing Imports</h2>
      {syncs.map((sync) => {
        const sourceMetadata = getSourceMetadataFromConnectionId(
          sync.source_attributes?.connection_id,
          sources,
        )
        const run = runs.find((item) => item.sync_id === sync?.id)
        const running = run ? !run.completed_at : false

        return (
          <div key={sync.id} className="flex flex-col gap-4 rounded border border-neutral-100 p-3">
            <div className="flex w-full flex-row items-center justify-between gap-3">
              <div className="flex w-full flex-row items-center gap-2 truncate">
                <ConnectionLogo src={sourceMetadata?.logo} />
                <span className="w-full truncate font-medium">{sync.source_attributes.object.name}</span>
              </div>
              <SyncStatus
                className="shrink-0"
                syncsLoading={false}
                syncs={[sync].filter(Boolean)}
                runsLoading={runsLoading}
                runs={runs}
                showAge
              />
            </div>
            <div className=" flex flex-row items-center gap-2">
              <Button onClick={() => toggleSync(sync)}>
                <i className={sync.paused ? "fa-solid fa-play" : "fa-solid fa-pause"} />
                {sync.paused ? "Resume" : "Pause"}
              </Button>
              <Button onClick={() => runSync(sync)} disabled={sync.paused || running}>
                <i className="fa-solid fa-play" />
                Run Now
              </Button>
              <Button onClick={() => openToSync(sync)}>
                <i className="fa-solid fa-pen" />
                Details
              </Button>
            </div>
          </div>
        )
      })}
    </>
  )
}
