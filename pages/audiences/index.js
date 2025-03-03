import Link from "next/link"
import { useState, useEffect } from "react"

import Error_ from "@components/Message/Error_"
import Loading from "@components/Message/Loading"
import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"

export default function Audiences() {
  const { workspaceAccessToken } = useCensusEmbedded()
  const [segments, setSegments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchSegments() {
      try {
        const response = await fetch("/api/segments", {
          method: "GET",
          headers: {
            authorization: `Bearer ${workspaceAccessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch segments")
        }

        const data = await response.json()
        setSegments(data.segments || [])
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    if (workspaceAccessToken) {
      fetchSegments()
    }
  }, [workspaceAccessToken])

  if (loading) return <Loading message="Loading segments..." />
  if (error) return <Error_ message={error} />

  return (
    <>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Audiences</h1>
          <Link href="/audiences/new">
            <a className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Create New Audience</a>
          </Link>
        </div>

        {segments.length === 0 ? (
          <div className="py-10 text-center">
            <p className="mb-4 text-gray-500">No audiences found</p>
            <p className="text-gray-500">Get started by creating your first audience segment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {segments.map((segment) => (
              <Link href={`/audiences/${segment.id}`} key={segment.id}>
                <a className="block rounded border p-4 transition-shadow hover:shadow-md">
                  <h2 className="mb-2 text-lg font-semibold">{segment.name}</h2>
                  <p className="mb-3 text-sm text-gray-600">{segment.description || "No description"}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Created: {new Date(segment.created_at).toLocaleDateString()}</span>
                    <span>{segment.count || 0} contacts</span>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
