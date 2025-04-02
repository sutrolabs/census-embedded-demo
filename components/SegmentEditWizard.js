import EmbeddedFrame from "@components/EmbeddedFrame/EmbeddedFrame"

export default function SegmentEditWizard({ refetchSegments, closeSegmentWizard, connectLink }) {
  return (
    <EmbeddedFrame
      connectLink={connectLink}
      onExit={async (connectionDetails) => {
        if (connectionDetails.status === "created") {
          await refetchSegments()
        }
        closeSegmentWizard()
      }}
    />
  )
}
