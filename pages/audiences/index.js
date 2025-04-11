import Head from "next/head"
import { useRouter } from "next/router"

import Button from "@components/Button/Button/Button"
import Header from "@components/Structural/Header/Header"
import { useSegments } from "@hooks/data/useSegments"
import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"
import { createDevModeAttr } from "@utils/devMode"

export default function Index() {
  const router = useRouter()
  const { workspaceAccessToken, embedMode, devMode, loading, setLoading } = useCensusEmbedded()
  const { segments, fetchSegments } = useSegments()

  // Handle segment selection
  const handleSegmentClick = (segment) => {
    router.push(`/audiences/${segment.id}`)
  }

  // Handle create segment button click
  const handleCreateSegmentClick = () => {
    router.push("/audiences/new")
  }

  return (
    <>
      <Head>
        <title>Audiences</title>
      </Head>
      <Header
        title="Audiences"
        action={
          <Button
            onClick={handleCreateSegmentClick}
            {...(devMode
              ? createDevModeAttr({
                  url: `/api/segment_management_links`,
                  method: "POST",
                  headers: `Authorization: Bearer ${workspaceAccessToken}`,
                  note: "Create a new segment management link",
                  link: "https://developers.getcensus.com/api-reference/segment-management-links/create-a-new-segment-management-link",
                })
              : {})}
          >
            <i className="fa-solid fa-plus" />
            Create New Audience
          </Button>
        }
      />
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="flex h-full flex-col overflow-y-auto p-3">
          {segments.length < 1 ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded bg-neutral-50 p-8">
              <Button onClick={handleCreateSegmentClick}>Create your first audience</Button>
            </div>
          ) : (
            <div>
              {segments.map((segment) => (
                <div
                  key={segment.id}
                  className="group"
                  {...(devMode
                    ? createDevModeAttr({
                        url: `/api/sources/${segment.source_id}/filter_segments`,
                        method: "GET",
                        headers: `Authorization: Bearer ${workspaceAccessToken}`,
                        note: "Lists segments",
                        link: "https://developers.getcensus.com/api-reference/segments/list-segments",
                      })
                    : {})}
                >
                  <button
                    className={`peer flex w-full flex-row justify-between rounded p-4 text-left text-lg transition-all duration-75 hover:bg-neutral-100`}
                    onClick={() => handleSegmentClick(segment)}
                  >
                    <span>{segment.name}</span>
                    {segment.record_count && (
                      <div className="flex flex-row items-center gap-2">
                        <i className="fa-solid fa-table-rows" />
                        {segment.record_count}
                      </div>
                    )}
                  </button>
                  <div className="h-px w-full bg-neutral-100 transition-all duration-75 peer-hover:opacity-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
