import Head from "next/head"
import { useState, useEffect } from "react"

import Button from "@components/Button"
import { b2bCustomerData } from "@components/Data/b2b-customer-data"
import Header from "@components/Structural/Header/Header"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/Table/Table"
import SourceConnectionFlow from "@components/Workflows/NewConnectionFlow/SourceConnectionFlow"

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

      <div className="flex h-full w-full flex-row items-stretch">
        <div className="h-full overflow-auto">
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
        </div>

        {showSidebar && (
          <div className="w-2/3 overflow-y-auto border-l border-neutral-100 bg-white p-4">
            <SourceConnectionFlow
              workspaceAccessToken={workspaceAccessToken}
              onComplete={handleSourceConnectionComplete}
              onCancel={() => setShowSidebar(false)}
              existingSourceId={selectedSourceId}
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
            />
          </div>
        )}
      </div>
    </>
  )
}
