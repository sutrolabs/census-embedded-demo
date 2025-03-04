import { useState } from "react"

import Button from "@components/Button/Button/Button"
import Card from "@components/Card/Card"
import SegmentEditWizard from "@components/SegmentEditWizard"
import RequestTooltip from "@components/Tooltip/RequestTooltip"
import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"
import { censusBaseUrl } from "@utils/url"

export function SegmentObject({ segment }) {
  const { workspaceAccessToken, setSegments, refetchSegments, devMode, embedMode } = useCensusEmbedded()

  const [loading, setLoading] = useState(false)
  const [disabledOverride, setDisabledOverride] = useState()
  const [editSegmentWizardLink, setEditSegmentWizardLink] = useState(null)
  const showEditSegmentWizard = !!editSegmentWizardLink

  const headers = {
    ["authorization"]: `Bearer ${workspaceAccessToken}`,
    ["content-type"]: "application/json",
  }

  const devModeHeaders = (
    <pre>
      {JSON.stringify(
        {
          ["authorization"]: "Bearer <workspaceAccessToken>",
        },
        null,
        2,
      )}
    </pre>
  )

  // Internal API endpoints
  const API_CREATE_EDIT_SEGMENT_LINK = "/api/create_edit_segment_management_link"
  const API_DELETE_SEGMENT = "/api/delete_segment"

  // Census API endpoints
  const CENSUS_API_SEGMENT_MANAGEMENT_EDIT_LINK = `${censusBaseUrl}/api/v1/sources/${segment.source_id}/filter_segments/${segment.id}`
  const CENSUS_API_DELETE_SEGMENT = `${censusBaseUrl}/api/v1/sources/${segment.source_id}/filter_segments/${segment.id}/segment_management_links`
  const CENSUS_API_DOCS_DELETE_SEGMENT =
    "https://developers.getcensus.com/api-reference/segments/delete-segment"
  const CENSUS_API_DOCS_EDIT_SEGMENT =
    "https://developers.getcensus.com/api-reference/segment-management-links/create-a-segment-management-link-to-edit-a-segment"

  const initiateEditSegmentWizard = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_CREATE_EDIT_SEGMENT_LINK, {
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
      const response = await fetch(API_DELETE_SEGMENT, {
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
      <Card className="flex flex-col gap-4">
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
                ) : molecule.filter_segment_id ? (
                  <div key={`existing-segment-${index}`}>
                    <li>{`Includes Members of 'High Ranking Contacts'`}</li>
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
        url={CENSUS_API_DELETE_SEGMENT}
        method="DELETE"
        headers={devModeHeaders}
        link={CENSUS_API_DOCS_DELETE_SEGMENT}
      />
      <RequestTooltip
        devMode={devMode}
        anchorSelect={`#configure-${segment.id}`}
        url={CENSUS_API_SEGMENT_MANAGEMENT_EDIT_LINK}
        method="POST"
        headers={devModeHeaders}
        link={CENSUS_API_DOCS_EDIT_SEGMENT}
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
