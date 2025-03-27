import { Text } from "@radix-ui/themes"

import Button from "@components/Button/Button/Button"
import Card from "@components/Card/Card"
import { NewDestinationSelectionMenu } from "@components/Command/NewDesitnationSelectionMenu/NewDestinationSelectionMenu"
import EmbeddedFrame from "@components/EmbeddedFrame/EmbeddedFrame"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/Tabs/Tabs"
import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"

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
                {!loading && !segment && (
                  <Text size="2" className="mt-2 text-neutral-500">
                    No segment found
                  </Text>
                )}
                {!loading && segment && !editSegmentWizardLink && (
                  <Text size="2" className="mt-2 text-neutral-500">
                    Failed to load segment editor
                  </Text>
                )}
              </Card>
            </div>
          )}
        </TabsContent>
        <TabsContent value="sync" className="flex flex-col">
          <div className="flex flex-row items-center justify-between border-b border-neutral-100 px-6 py-4">
            <Text>Sync {segment?.name}</Text>
            <div>
              <Button>New Sync</Button>
              <NewDestinationSelectionMenu
                workspaceAccessToken={workspaceAccessToken}
                destinationTypes={destinationTypes}
                trigger="New Destination"
              />
            </div>
          </div>

          {destinations.length > 0 ? (
            <></>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
              <Text size="5">No destinations connected</Text>
              <Text size="2" className="text-neutral-500">
                Connect a destination to sync this audience
              </Text>
              <NewDestinationSelectionMenu
                workspaceAccessToken={workspaceAccessToken}
                destinationTypes={destinationTypes}
                destinations={destinations}
                trigger="New Destination"
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
