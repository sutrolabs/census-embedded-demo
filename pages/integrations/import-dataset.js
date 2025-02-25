import { b2bCustomerData } from "@assets/fake-data/fake-customer-dataset/b2b-customer-data"
import Head from "next/head"

// import Source from "@components/Source"
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
  return (
    <>
      <Head>
        <title>Census Embedded Demo App</title>
      </Head>
      <Header title="Data Management" />
      <div className="flex flex-row items-center border-b border-neutral-100 px-8 py-3">Customers</div>
      <div className="flex h-full flex-row items-stretch justify-stretch">
        <div className="mx-auto h-full w-full overflow-y-auto">
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className="w-[100px]">Company</TableHead>
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
                  <TableCell className=" font-medium">{customer.customer_id}</TableCell>
                  <TableCell className="truncate">{customer.company_name}</TableCell>
                  <TableCell>{customer.hq_city}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{customer.industry}</TableCell>
                  <TableCell>{customer.contract_value.toLocaleString()}</TableCell>
                  <TableCell>{new Date(customer.last_logged_in).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(customer.contract_signed).toLocaleDateString()}</TableCell>
                  <TableCell>{customer.campaigns_received}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-8 py-6">
            {/* <DevelopmentMessage
            message="On this page, the end user (your customer) can connect their source to
            your destination."
          /> */}
            {/* <p>Step 1: Connect your data source</p>
          <Source
            label="Redshift"
            type="redshift"
            iconClassName="fa-brands fa-aws"
            workspaceAccessToken={workspaceAccessToken}
            sources={sources}
            destinations={destinations}
            setSources={setSources}
            refetchSources={refetchSources}
            refetchSourceConnectLinks={refetchSourceConnectLinks}
            sourceConnectLinks={sourceConnectLinks}
            sourceEmbedLinks={sourceEmbedLinks}
            embedMode={embedMode}
            devMode={devMode}
            syncManagementLinks={syncManagementLinks}
            refetchSyncManagementLinks={refetchSyncManagementLinks}
            syncs={syncs}
            setSyncs={setSyncs}
            refetchSyncs={refetchSyncs}
            runsLoading={runsLoading}
            runs={runs}
          />
          <Source
            label="BigQuery"
            type="big_query"
            iconClassName="fa-brands fa-google"
            workspaceAccessToken={workspaceAccessToken}
            sources={sources}
            destinations={destinations}
            setSources={setSources}
            refetchSources={refetchSources}
            sourceConnectLinks={sourceConnectLinks}
            refetchSourceConnectLinks={refetchSourceConnectLinks}
            sourceEmbedLinks={sourceEmbedLinks}
            embedMode={embedMode}
            devMode={devMode}
            syncManagementLinks={syncManagementLinks}
            refetchSyncManagementLinks={refetchSyncManagementLinks}
            syncs={syncs}
            setSyncs={setSyncs}
            refetchSyncs={refetchSyncs}
            runsLoading={runsLoading}
            runs={runs}
          />
          <Source
            label="GoogleSheets"
            type="google_sheets"
            iconClassName="fa-brands fa-google"
            workspaceAccessToken={workspaceAccessToken}
            sources={sources}
            destinations={destinations}
            setSources={setSources}
            refetchSources={refetchSources}
            sourceConnectLinks={sourceConnectLinks}
            refetchSourceConnectLinks={refetchSourceConnectLinks}
            sourceEmbedLinks={sourceEmbedLinks}
            embedMode={embedMode}
            devMode={devMode}
            syncManagementLinks={syncManagementLinks}
            refetchSyncManagementLinks={refetchSyncManagementLinks}
            syncs={syncs}
            setSyncs={setSyncs}
            refetchSyncs={refetchSyncs}
            runsLoading={runsLoading}
            runs={runs}
          />
          <Source
            label="Snowflake"
            type="snowflake"
            iconClassName="fa-solid fa-snowflake"
            workspaceAccessToken={workspaceAccessToken}
            sources={sources}
            destinations={destinations}
            setSources={setSources}
            refetchSources={refetchSources}
            sourceConnectLinks={sourceConnectLinks}
            refetchSourceConnectLinks={refetchSourceConnectLinks}
            sourceEmbedLinks={sourceEmbedLinks}
            embedMode={embedMode}
            devMode={devMode}
            syncManagementLinks={syncManagementLinks}
            refetchSyncManagementLinks={refetchSyncManagementLinks}
            syncs={syncs}
            setSyncs={setSyncs}
            refetchSyncs={refetchSyncs}
            runsLoading={runsLoading}
            runs={runs}
          /> */}
          </div>
        </div>
        <div className="w-[450px] border-l border-neutral-100 p-4">Sidebar with sources</div>
      </div>
    </>
  )
}
