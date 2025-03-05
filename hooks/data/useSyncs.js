import { useState, useEffect } from "react"

import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"

const API_SYNCS_ENDPOINT = "/api/list_syncs"
const API_TRIGGER_SYNC_ENDPOINT = "/api/trigger_sync_run"
const API_SET_SYNC_PAUSED_ENDPOINT = "/api/set_sync_paused"
const API_DELETE_SYNC_ENDPOINT = "/api/delete_sync"

export function useSyncs() {
  const [syncs, setSyncs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { workspaceAccessToken } = useCensusEmbedded()

  const fetchSyncs = async () => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(API_SYNCS_ENDPOINT, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch syncs: ${response.statusText}`)
      }

      const data = await response.json()
      setSyncs(data)
      return data
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  const triggerSyncRun = async (syncId) => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(API_TRIGGER_SYNC_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({ sync_id: syncId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to trigger sync run: ${response.statusText}`)
      }

      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const setSyncPaused = async (syncId, paused) => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(API_SET_SYNC_PAUSED_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({ sync_id: syncId, paused }),
      })

      if (!response.ok) {
        throw new Error(`Failed to set sync paused state: ${response.statusText}`)
      }

      // Update the local state
      const updatedSync = await response.json()
      setSyncs((prevSyncs) => prevSyncs.map((sync) => (sync.id === syncId ? { ...sync, paused } : sync)))

      return updatedSync
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteSync = async (syncId) => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workspaceAccessToken}`,
      }

      const response = await fetch(`${API_DELETE_SYNC_ENDPOINT}?id=${syncId}`, {
        method: "DELETE",
        headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to delete sync: ${response.statusText}`)
      }

      // Update the local state
      setSyncs((prevSyncs) => prevSyncs.filter((sync) => sync.id !== syncId))

      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (workspaceAccessToken) {
      fetchSyncs()
    }
  }, [workspaceAccessToken])

  return {
    syncs,
    loading,
    error,
    fetchSyncs,
    triggerSyncRun,
    setSyncPaused,
    deleteSync,
  }
}
