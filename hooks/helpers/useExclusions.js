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
 */
export const EXCLUDED_SOURCE_CONNECTIONS = ["entity_resolution", "http_request"]

/**
 * Categories or types that should be excluded from specific features
 * Can be expanded as needed for other exclusion cases
 */
export const EXCLUSIONS = {
  destinations: EXCLUDED_DESTINATIONS,
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
