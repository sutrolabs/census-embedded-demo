import { useState } from "react"

import Button from "@components/Button"
import { Card } from "@components/Card"
import RequestTooltip from "@components/RequestTooltip"
import SegmentEditWizard from "@components/SegmentEditWizard"
import { censusBaseUrl } from "@utils/url"

export function SegmentObject({
  workspaceAccessToken,
  segment,
  setSegments,
  refetchSegments,
  devMode,
  embedMode,
}) {
  const [loading, setLoading] = useState(false)
  const [disabledOverride, setDisabledOverride] = useState()
  const [editSegmentWizardLink, setEditSegmentWizardLink] = useState(null)
  const showEditSegmentWizard = !!editSegmentWizardLink

  const headers = {
    ["authorization"]: `Bearer ${workspaceAccessToken}`,
    ["content-type"]: "application/json",
  }

  const initiateEditSegmentWizard = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/create_edit_segment_management_link", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          sourceId: segment.source_id,
          segmentId: segment.id,
        }),
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const data = await response.json()
      if (embedMode) {
        setEditSegmentWizardLink(data.uri)
      } else {
        window.location.href = data.uri
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteSegment = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/delete_segment", {
        method: "DELETE",
        headers: headers,
        body: JSON.stringify({
          sourceId: segment.source_id,
          segmentId: segment.id,
        }),
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      setSegments((segments) => segments.filter((item) => item.id !== segment.id))
      await refetchSegments()
    } finally {
      setLoading(false)
      setDisabledOverride()
    }
  }

  return (
    <>
      <Card className="flex flex-col gap-4" variant={showEditSegmentWizard ? "thin" : "default"}>
        <h4 className="flex flex-row justify-between">
          {!showEditSegmentWizard && (
            <>
              <span className="font-medium">{`Segment: ${segment.name}`}</span>
              <div className="flex flex-row items-center gap-2">
                <a id={`delete-${segment.id}`}>
                  <Button onClick={deleteSegment}>
                    <i className="fa-solid fa-trash" />
                  </Button>
                </a>
              </div>
            </>
          )}
        </h4>
        {showEditSegmentWizard ? (
          <SegmentEditWizard
            connectLink={editSegmentWizardLink}
            closeSegmentWizard={() => setEditSegmentWizardLink(null)}
            refetchSegments={refetchSegments}
          />
        ) : (
          <div>
            <p className="mb-2 text-sm">Constraints:</p>
            <ul className="ml-6 flex grow list-disc flex-col gap-1 text-sm">
              {segment.molecules.map((molecule, index) =>
                typeof molecule === "string" ? (
                  <div key={`string-${index}`} className="my-2">
                    {molecule}
                  </div>
                ) : (
                  <div key={`object-${index}`}>
                    <li>{`Attribute: ${molecule.attribute}`}</li>
                    <li>{`Operator: ${molecule.operator}`}</li>
                    <li>{`Value: ${molecule.value}`}</li>
                  </div>
                ),
              )}
            </ul>
            <div className="mt-2 flex flex-row items-center justify-between gap-2">
              <div className="flex flex-row gap-3">
                <a id={`configure-${segment.id}`}>
                  <Button className="text-sm" disabled={loading} onClick={initiateEditSegmentWizard}>
                    <i className="fa-solid fa-gear mr-2" />
                    Configure
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </Card>

      <RequestTooltip
        devMode={devMode}
        anchorSelect={`#delete-${segment.id}`}
        url={`${censusBaseUrl}/api/v1/sources/${segment.source_id}/filter_segments/${segment.id}`}
        method="DELETE"
        headers={
          <pre>
            {JSON.stringify(
              {
                ["authorization"]: "Bearer <workspaceAccessToken>",
              },
              null,
              2,
            )}
          </pre>
        }
        link="https://developers.getcensus.com/api-reference/segments/delete-segment"
      />
      <RequestTooltip
        devMode={devMode}
        anchorSelect={`#configure-${segment.id}`}
        url={`${censusBaseUrl}/api/v1/sources/${segment.source_id}/filter_segments/${segment.id}/segment_management_links`}
        method="POST"
        headers={
          <pre>
            {JSON.stringify(
              {
                ["authorization"]: "Bearer <workspaceAccessToken>",
              },
              null,
              2,
            )}
          </pre>
        }
        link="https://developers.getcensus.com/api-reference/segment-management-links/create-a-segment-management-link-to-edit-a-segment"
        body={
          embedMode ? null : (
            <pre>
              {JSON.stringify(
                {
                  redirect_uri: window.location.href,
                },
                null,
                2,
              )}
            </pre>
          )
        }
      />
    </>
  )
}
