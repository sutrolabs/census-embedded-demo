import { Text } from "@radix-ui/themes"

import Button from "@components/Button/Button/Button"
import Card from "@components/Card/Card"
import EmbeddedFrame from "@components/EmbeddedFrame/EmbeddedFrame"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/Tabs/Tabs"
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
                onExit={() => {
                  setEditSegmentWizardLink(null)
                }}
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
          <TabsContent value="sync" className="flex flex-col">
            <div className="flex flex-row items-center justify-between border-b border-neutral-100 px-6 py-4">
              <Text>Sync {segment.name}</Text>
              <Button>New Sync</Button>
              <DestinationFlowProvider
                workspaceAccessToken={workspaceAccessToken}
                destinationConnectLinks={destinationConnectLinks}
                refetchDestinationConnectLinks={() => {
                  /* implement refresh logic */
                }}
                destinations={destinations}
                setDestinations={setDestinationConnectLinks}
                availableDestinationTypes={destinationTypes}
                selectedSegment={segment}
              >
                <NewDestinationDrawer />
              </DestinationFlowProvider>
            </div>

            {destinations.length > 0 ? (
              <></>
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
                  selectedSegment={segment}
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
                } else {
                  // Only clear create wizard if not successful
                  setCreateSegmentWizardLink(null)
                }
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
