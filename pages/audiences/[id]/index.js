"use client"
import { Text } from "@radix-ui/themes"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

import EmbeddedFrame from "@components/EmbeddedFrame/EmbeddedFrame"
import Loading from "@components/Loading/Loading"
import Header from "@components/Structural/Header/Header"
import SegmentTabs from "@components/Tabs/SegmentTabs"
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

  const initiateEditSegmentWizard = useCallback(
    async (segment) => {
      const headers = {
        ["authorization"]: `Bearer ${workspaceAccessToken}`,
        ["content-type"]: "application/json",
      }

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
    },
    [workspaceAccessToken, setLoading],
  )

  useEffect(() => {
    if (id && segments) {
      const foundSegment = segments.find((s) => String(s.id) === String(id))
      setSegment(foundSegment)
      if (foundSegment) {
        initiateEditSegmentWizard(foundSegment)
      }
    }
  }, [id, segments, initiateEditSegmentWizard])

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

      <div className="flex h-full w-full flex-col overflow-hidden">
        <SegmentTabs segmentId={id} currentTab="segment" />
        <div className="h-full w-full">
          {editSegmentWizardLink ? (
            <EmbeddedFrame
              className="h-full w-full"
              connectLink={editSegmentWizardLink}
              onExit={() => {
                toast("Audience saved")
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              {loading && <Loading />}
              {!loading && segment && !editSegmentWizardLink && (
                <Text size="2" className="mt-2 text-neutral-500">
                  Failed to load segment editor
                </Text>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
