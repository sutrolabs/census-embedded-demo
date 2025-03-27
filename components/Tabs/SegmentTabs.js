import { useRouter } from "next/router"

import { Tabs, TabsList, TabsTrigger } from "@components/Tabs/Tabs"

export default function SegmentTabs({ segmentId, currentTab }) {
  const router = useRouter()

  const handleTabChange = (value) => {
    if (value === "segment") {
      router.push(`/audiences/${segmentId}`)
    } else if (value === "sync") {
      router.push(`/audiences/${segmentId}/syncs`)
    }
  }

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className=" w-full">
      <TabsList>
        <div className="mx-auto flex w-2/5 items-center justify-center">
          <TabsTrigger value="segment">Audience</TabsTrigger>
          <TabsTrigger value="sync">Sync</TabsTrigger>
        </div>
      </TabsList>
    </Tabs>
  )
}
