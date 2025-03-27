"use client"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

import Header from "@components/Structural/Header/Header"
import SegmentDetailLayout from "@components/Structural/Layouts/SegmentLayout"
import { useDestinations } from "@hooks/data/useDestinations"
import { useSegments } from "@hooks/data/useSegments"
import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"

export default function SegmentDetail() {
  const router = useRouter()
  const { id } = router.query
  const { destinations, destinationTypes } = useDestinations()
  const { segments, fetchSegments } = useSegments()
  const { workspaceAccessToken, embedMode, loading, setLoading } = useCensusEmbedded()
  const [editSegmentWizardLink, setEditSegmentWizardLink] = useState(null)
  const [destinationConnectLinks, setDestinationConnectLinks] = useState([])
  const [segment, setSegment] = useState(null)

  const headers = {
    ["authorization"]: `Bearer ${workspaceAccessToken}`,
    ["content-type"]: "application/json",
  }

  useEffect(() => {
    if (id && segments) {
      const foundSegment = segments.find((s) => String(s.id) === String(id))

      setSegment(foundSegment)
      if (foundSegment) {
        initiateEditSegmentWizard(foundSegment)
      }
    }
  }, [id, segments])

  const initiateEditSegmentWizard = async (segment) => {
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
      if (!data.uri) {
        throw new Error("No URI returned from API")
      }
      setEditSegmentWizardLink(data.uri)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>{segment?.name || "Audience Detail"}</title>
      </Head>
      <Header
        title="Audiences"
        nestedPage={segment?.name}
        backButtonClick={() => router.push("/audiences")}
      />

      <SegmentDetailLayout
        segment={segment}
        createSegmentWizardLink={null}
        editSegmentWizardLink={editSegmentWizardLink}
        setEditSegmentWizardLink={setEditSegmentWizardLink}
        destinations={destinations}
        destinationConnectLinks={destinationConnectLinks}
        setDestinationConnectLinks={setDestinationConnectLinks}
        setCreateSegmentWizardLink={() => {}}
        destinationTypes={destinationTypes}
      />
    </>
  )
}
