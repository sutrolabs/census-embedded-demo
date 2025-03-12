import { Text } from "@radix-ui/themes"

import Card from "@components/Card/Card"
import EmbeddedFrame from "@components/EmbeddedFrame/EmbeddedFrame"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/Tabs/Tabs"
import Toggle from "@components/Toggle/Toggle"
import NewDestinationDrawer from "@components/Workflows/NewDestinationFlow/NewDestinationDrawer"
import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"
import { DestinationFlowProvider } from "@providers/DestinationFlowProvider"

export default function SegmentDetailLayout({
  segment,
  createSegmentWizardLink,
  editSegmentWizardLink,
  setEditSegmentWizardLink,
  destinations,
  destinationConnectLinks,
  setDestinationConnectLinks,
  setCreateSegmentWizardLink,
  onSegmentCreated,
  destinationTypes,
}) {
  const { loading, workspaceAccessToken } = useCensusEmbedded()
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {segment ? (
        // Populated state - when a segment exists
        <Tabs defaultValue="segment" className="h-full w-full">
          <TabsList>
            <div className="flex shrink-0 flex-row items-center gap-6">
              <div className="text-lg font-medium">{segment.name}</div>
            </div>
            <div className="mx-auto flex w-2/5 items-center justify-center">
              <TabsTrigger value="segment">Audience</TabsTrigger>
              <TabsTrigger value="sync">Sync</TabsTrigger>
            </div>
          </TabsList>
          <TabsContent value="segment" className="h-full w-full">
            {editSegmentWizardLink ? (
              <EmbeddedFrame
                className="h-full w-full"
                connectLink={editSegmentWizardLink}
                onExit={() => setEditSegmentWizardLink(editSegmentWizardLink)}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Card className="p-6 text-center">
                  <Text size="5">Loading segment details...</Text>
                  {loading && (
                    <Text size="2" className="mt-2 text-neutral-500">
                      Please wait while we load the segment editor
                    </Text>
                  )}
                </Card>
              </div>
            )}
          </TabsContent>
          <TabsContent value="sync" className="flex flex-col p-4">
            {destinations.length > 0 ? (
              <>
                {destinations.map((destination) => {
                  return (
                    <div
                      className="flex flex-row items-center justify-between border-b border-neutral-100 p-4"
                      key={destination.id}
                    >
                      <span>{destination.name}</span>
                      <Toggle />
                    </div>
                  )
                })}
                <DestinationFlowProvider
                  workspaceAccessToken={workspaceAccessToken}
                  destinationConnectLinks={destinationConnectLinks}
                  refetchDestinationConnectLinks={() => {
                    /* implement refresh logic */
                  }}
                  destinations={destinations}
                  setDestinations={setDestinationConnectLinks}
                  availableDestinationTypes={destinationTypes}
                >
                  <NewDestinationDrawer />
                </DestinationFlowProvider>
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
                <Text size="5">No destinations connected</Text>
                <Text size="2" className="text-neutral-500">
                  Connect a destination to sync this audience
                </Text>
                <DestinationFlowProvider
                  workspaceAccessToken={workspaceAccessToken}
                  destinationConnectLinks={destinationConnectLinks}
                  refetchDestinationConnectLinks={() => {
                    /* implement refresh logic */
                  }}
                  destinations={destinations}
                  setDestinations={setDestinationConnectLinks}
                  availableDestinationTypes={destinationTypes}
                >
                  <NewDestinationDrawer />
                </DestinationFlowProvider>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        // New state - when creating a new segment
        <div className="flex h-full w-full flex-col">
          {createSegmentWizardLink ? (
            <EmbeddedFrame
              className="h-full w-full"
              connectLink={createSegmentWizardLink}
              onExit={(response) => {
                if (response?.status === "created") {
                  // Handle successful creation
                  onSegmentCreated?.(response.data)
                }
                setCreateSegmentWizardLink(null)
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Card className="p-6 text-center">
                <Text size="5">Create a new audience</Text>
                <Text size="2" className="mt-2 text-neutral-500">
                  Define your audience criteria to get started
                </Text>
                {loading && (
                  <Text size="2" className="mt-2 text-neutral-500">
                    Please wait while we load the segment editor
                  </Text>
                )}
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
