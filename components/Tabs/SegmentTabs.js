import { useRouter } from "next/router"

import { Tabs, TabsList, TabsTrigger } from "@components/Tabs/Tabs"

export default function SegmentTabs({ segmentId, currentTab }) {
  const router = useRouter()

  const handleTabChange = (value) => {
    if (value === "segment") {
      router.push(`/audiences/${segmentId}`)
    } else if (value === "destinations") {
      router.push(`/audiences/${segmentId}/destinations`)
    }
  }

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className=" w-full">
      <TabsList>
        <div className="mx-auto flex w-2/5 items-center justify-center">
          <TabsTrigger value="segment">Audience</TabsTrigger>
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
        </div>
      </TabsList>
    </Tabs>
  )
}
