import { useState, useEffect, useCallback } from "react"

import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"

const API_DESTINATIONS_ENDPOINT = "/api/list_destinations"
const API_DELETE_DESTINATION_ENDPOINT = "/api/delete_destination"
const API_DESTINATION_CONNECT_LINK_ENDPOINT = "/api/create_destination_connect_link"
const API_DESTINATION_TYPES_ENDPOINT = "/api/list_connectors"

export function useDestinations() {
  const [destinations, setDestinations] = useState([])
  const [destinationTypes, setDestinationTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { workspaceAccessToken } = useCensusEmbedded()

  const fetchDestinations = useCallback(async () => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(API_DESTINATIONS_ENDPOINT, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch destinations: ${response.statusText}`)
      }

      const data = await response.json()
      setDestinations(data)
      return data
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [workspaceAccessToken])

  const fetchDestinationTypes = useCallback(async () => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(API_DESTINATION_TYPES_ENDPOINT, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch destination types: ${response.statusText}`)
      }

      const data = await response.json()
      setDestinationTypes(data)
      return data
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [workspaceAccessToken])

  const deleteDestination = async (destinationId) => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(`${API_DELETE_DESTINATION_ENDPOINT}?id=${destinationId}`, {
        method: "DELETE",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to delete destination: ${response.statusText}`)
      }

      // Update the local state
      setDestinations((prevDestinations) =>
        prevDestinations.filter((destination) => destination.id !== destinationId),
      )

      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createDestinationConnectLink = async (destinationType, returnUrl) => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(API_DESTINATION_CONNECT_LINK_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({
          destination_type: destinationType,
          return_url: returnUrl,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create destination connect link: ${response.statusText}`)
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
      fetchDestinations()
      fetchDestinationTypes()
    }
  }, [workspaceAccessToken, fetchDestinations, fetchDestinationTypes])

  return {
    destinations,
    destinationTypes,
    loading,
    error,
    fetchDestinations,
    fetchDestinationTypes,
    deleteDestination,
    createDestinationConnectLink,
  }
}
