import Head from "next/head"
import { useState, useEffect } from "react"

import Button from "@components/Button"
import { SourceFlowProvider } from "@components/Contexts/SourceFlowContext"
import { b2bCustomerData } from "@components/Data/b2b-customer-data"
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
import { getLogoForSourceType } from "@hooks/useSourceLogos"

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

  const getSourceMetadataFromConnectionId = (connectionId, sources = []) => {
    if (!connectionId || !sources.length) return null

    // Find the source with the matching connection_id
    const sourceEntity = sources.find((source) => source.id === connectionId)

    if (!sourceEntity) return null

    // Get the source type information
    const sourceType = getSourceTypeFromServiceName(sourceEntity.type)

    // Get the logo for the source type
    const logo = getLogoForSourceType(sourceType)

    return {
      id: sourceEntity.id,
      name: sourceEntity.name,
      type: sourceEntity.type,
      object: sourceEntity.object,
      logo,
      sourceType,
      // Add any other metadata you need
    }
  }

  const getSourceTypeFromServiceName = (serviceName, availableSourceTypes = []) => {
    if (!serviceName) return null

    // If availableSourceTypes is provided, search in it
    if (availableSourceTypes.length) {
      return availableSourceTypes.find((type) => type.service_name === serviceName) || null
    }

    // Otherwise, return a minimal source type object
    return {
      service_name: serviceName,
      label: serviceName.charAt(0).toUpperCase() + serviceName.slice(1).replace(/_/g, " "),
    }
  }

  return (
    <>
      <Head>
        <title>Census Embedded Demo App</title>
      </Head>
      <Header title="Data Management" />
      <div className="flex flex-row items-center justify-between border-b border-neutral-100 px-8 py-3">
        Customers{" "}
        <Button size="small" onClick={() => setShowSidebar(!showSidebar)}>
          Import Data
        </Button>
      </div>

      <div className="flex h-full w-full flex-row items-stretch overflow-hidden">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] pl-6">Company</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>contract_value</TableHead>
              <TableHead>last_logged_in</TableHead>
              <TableHead>contract_signed</TableHead>
              <TableHead>campaigns_received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {b2bCustomerData.map((customer) => (
              <TableRow key={customer.customer_id}>
                <TableCell className="truncate pl-6">{customer.company_name}</TableCell>
                <TableCell className="max-w-[150px] truncate">{customer.hq_city}</TableCell>
                <TableCell className="max-w-[200px] truncate">{customer.industry}</TableCell>
                <TableCell>{customer.contract_value.toLocaleString()}</TableCell>
                <TableCell>{new Date(customer.last_logged_in).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(customer.contract_signed).toLocaleDateString()}</TableCell>
                <TableCell>{customer.campaigns_received}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {showSidebar && (
          <div className="flex h-full w-2/3 max-w-[800px] flex-col gap-4 overflow-hidden border-l border-neutral-100 bg-white p-6 shadow-md ">
            {syncs && (
              <>
                <h2 className="text-base font-medium">Existing Imports</h2>
                {syncs.map((sync) => {
                  const sourceMetadata = getSourceMetadataFromConnectionId(
                    sync.source_attributes?.connection_id,
                    sources,
                  )
                  return (
                    <div key={sync.id} className="flex flex-col gap-4 rounded border border-neutral-100 p-3">
                      <div className="flex flex-row items-center justify-between gap-4">
                        <div className="flex flex-row items-center gap-2">
                          <ConnectionLogo src={sourceMetadata?.logo} />
                          <span className="font-medium">{sync.source_attributes.object.name}</span>
                        </div>
                        <SyncStatus
                          syncsLoading={false}
                          syncs={[sync].filter(Boolean)}
                          runsLoading={runsLoading}
                          runs={runs}
                          showAge
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button>
                          <i className="fa-solid fa-pause" />
                          Pause
                        </Button>
                        <Button>
                          <i className="fa-solid fa-play" />
                          Run Now
                        </Button>
                        <Button>
                          <i className="fa-solid fa-cog" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
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
              <NewSourceDrawer />
            </SourceFlowProvider>
          </div>
        )}
      </div>
    </>
  )
}
