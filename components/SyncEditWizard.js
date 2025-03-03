import EmbeddedFrame from "@components/EmbeddedFrame/EmbeddedFrame"

export default function SyncEditWizard({ refetchSyncs, closeSyncWizard, connectLink }) {
  return (
    <EmbeddedFrame
      connectLink={connectLink}
      onExit={async (connectionDetails) => {
        if (connectionDetails.status === "created") {
          await refetchSyncs()
        }
        closeSyncWizard()
      }}
    />
  )
}
