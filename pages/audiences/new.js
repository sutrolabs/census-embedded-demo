import { Text } from "@radix-ui/themes"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

import Card from "@components/Card/Card"
import EmbeddedFrame from "@components/EmbeddedFrame/EmbeddedFrame"
import Header from "@components/Structural/Header/Header"
import { useDestinations } from "@hooks/data/useDestinations"
import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"

export default function NewSegment() {
  const router = useRouter()
  const { destinations, destinationTypes } = useDestinations()
  const { workspaceAccessToken, embedMode, loading, setLoading } = useCensusEmbedded()
  const [createSegmentWizardLink, setCreateSegmentWizardLink] = useState(null)
  const [destinationConnectLinks, setDestinationConnectLinks] = useState([])

  const headers = {
    ["authorization"]: `Bearer ${workspaceAccessToken}`,
    ["content-type"]: "application/json",
  }

  const initiateCreateSegmentWizard = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/create_segment_management_link", {
        method: "POST",
        headers: headers,
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const data = await response.json()
      if (embedMode) {
        setCreateSegmentWizardLink(data.uri)
      } else {
        window.location.href = data.uri
      }
    } finally {
      setLoading(false)
    }
  }

  // Initialize the create wizard when the component mounts
  useEffect(() => {
    initiateCreateSegmentWizard()
  }, [])

  return (
    <>
      <Head>
        <title>New Audience</title>
      </Head>
      <Header title="Audiences" nestedPage="New Audience" backButtonClick={() => router.push("/audiences")} />
      <div className="flex h-full w-full flex-col">
        {createSegmentWizardLink ? (
          <EmbeddedFrame
            className="h-full w-full"
            connectLink={createSegmentWizardLink}
            onExit={(response) => {
              if (response?.status === "created") {
                // Handle successful creation
                router.push(`/audiences/${response.details.id}`)
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
    </>
  )
}
