import { useState, useEffect } from "react"

import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"

const API_SEGMENTS_ENDPOINT = "/api/list_segments"
const API_DELETE_SEGMENT_ENDPOINT = "/api/delete_segment"
const API_SEGMENT_MANAGEMENT_LINK_ENDPOINT = "/api/create_segment_management_link"
const API_EDIT_SEGMENT_MANAGEMENT_LINK_ENDPOINT = "/api/create_edit_segment_management_link"

export function useSegments() {
  const [segments, setSegments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { workspaceAccessToken } = useCensusEmbedded()

  const fetchSegments = async () => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(API_SEGMENTS_ENDPOINT, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch segments: ${response.statusText}`)
      }

      const data = await response.json()
      setSegments(data)
      return data
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  const createSegment = async (segmentData) => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(API_SEGMENTS_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify(segmentData),
      })

      if (!response.ok) {
        throw new Error(`Failed to create segment: ${response.statusText}`)
      }

      const newSegment = await response.json()
      setSegments((prevSegments) => [...prevSegments, newSegment])
      return newSegment
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteSegment = async (segmentId) => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(`${API_DELETE_SEGMENT_ENDPOINT}?id=${segmentId}`, {
        method: "DELETE",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to delete segment: ${response.statusText}`)
      }

      // Update the local state
      setSegments((prevSegments) => prevSegments.filter((segment) => segment.id !== segmentId))

      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createSegmentManagementLink = async (returnUrl) => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(API_SEGMENT_MANAGEMENT_LINK_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({ return_url: returnUrl }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create segment management link: ${response.statusText}`)
      }

      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createEditSegmentManagementLink = async (segmentId, returnUrl) => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(API_EDIT_SEGMENT_MANAGEMENT_LINK_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({
          segment_id: segmentId,
          return_url: returnUrl,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create edit segment management link: ${response.statusText}`)
      }

      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (workspaceAccessToken) {
      fetchSegments()
    }
  }, [workspaceAccessToken])

  return {
    segments,
    loading,
    error,
    fetchSegments,
    createSegment,
    deleteSegment,
    createSegmentManagementLink,
    createEditSegmentManagementLink,
  }
}
