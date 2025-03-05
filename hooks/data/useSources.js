import { useState, useEffect } from "react"

import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"

const API_SOURCES_ENDPOINT = "/api/list_sources"
const API_DELETE_SOURCE_ENDPOINT = "/api/delete_source"
const API_SOURCE_CONNECT_LINK_ENDPOINT = "/api/create_source_connect_link"
const API_SOURCE_TYPES_ENDPOINT = "/api/list_source_types"
const API_MODELS_FOR_SOURCE_ENDPOINT = "/api/list_models_for_source"

export function useSources() {
  const [sources, setSources] = useState([])
  const [sourceTypes, setSourceTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { workspaceAccessToken } = useCensusEmbedded()

  const fetchSources = async () => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(API_SOURCES_ENDPOINT, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch sources: ${response.statusText}`)
      }

      const data = await response.json()
      setSources(data)
      return data
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  const fetchSourceTypes = async () => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(API_SOURCE_TYPES_ENDPOINT, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch source types: ${response.statusText}`)
      }

      const data = await response.json()
      setSourceTypes(data)
      return data
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  const fetchModelsForSource = async (sourceId) => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(`${API_MODELS_FOR_SOURCE_ENDPOINT}?source_id=${sourceId}`, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch models for source: ${response.statusText}`)
      }

      return await response.json()
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  const deleteSource = async (sourceId) => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(`${API_DELETE_SOURCE_ENDPOINT}?id=${sourceId}`, {
        method: "DELETE",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to delete source: ${response.statusText}`)
      }

      // Update the local state
      setSources((prevSources) => prevSources.filter((source) => source.id !== sourceId))

      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createSourceConnectLink = async (sourceType, returnUrl) => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(API_SOURCE_CONNECT_LINK_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({
          source_type: sourceType,
          return_url: returnUrl,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create source connect link: ${response.statusText}`)
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
      fetchSources()
      fetchSourceTypes()
    }
  }, [workspaceAccessToken])

  return {
    sources,
    sourceTypes,
    loading,
    error,
    fetchSources,
    fetchSourceTypes,
    fetchModelsForSource,
    deleteSource,
    createSourceConnectLink,
  }
}
