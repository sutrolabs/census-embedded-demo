/**
 * Centralized configuration for excluded items across the application
 */

/**
 * Destinations that should be excluded from being shown or created
 * Currently used in:
 * - NewDestinationSelectionMenu
 * - Destinations page
 */
export const EXCLUDED_DESTINATION_CONNECTIONS = ["internal", "test"]

/**
 * Source connections that should be excluded from being shown or created
 * Currently used in:
 * - SourceTypeSelection
 * - ExistingSourcesList
 */
export const EXCLUDED_SOURCE_CONNECTIONS = ["entity_resolution", "http_request", "embedded_demo"]

/**
 * Categories or types that should be excluded from specific features
 * Can be expanded as needed for other exclusion cases
 */
export const EXCLUSIONS = {
  destinations: EXCLUDED_DESTINATION_CONNECTIONS,
  sources: EXCLUDED_SOURCE_CONNECTIONS,
}

/**
 * Helper function to check if an item is excluded
 * @param {string} item - The item to check
 * @param {string} category - The category to check against ('destinations' or 'sources')
 * @returns {boolean} - Whether the item is excluded
 */
export function isExcluded(item, category) {
  if (!EXCLUSIONS[category]) {
    return false
  }
  return EXCLUSIONS[category].includes(item)
}

/**
 * Helper function to filter syncs based on excluded source connections
 * @param {Array} syncs - Array of syncs to filter
 * @param {Array} sources - Array of sources to check against
 * @returns {Array} - Filtered array of syncs
 */
export function filterSyncsWithExcludedSources(syncs, sources) {
  if (!syncs || !sources) {
    return []
  }

  return syncs.filter((sync) => {
    const sourceId = sync.source_attributes?.connection_id
    if (!sourceId) return true // Keep syncs without source attributes

    const source = sources.find((s) => s.id === sourceId)
    if (!source) return true // Keep syncs with unknown sources

    return !EXCLUDED_SOURCE_CONNECTIONS.includes(source.label)
  })
}
