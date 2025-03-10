/**
 * Creates a data attribute object for dev mode hover cards
 *
 * @param {Object} options - The options for the dev mode hover card
 * @param {string} options.url - The request URL
 * @param {string} options.method - The request method
 * @param {string} options.headers - The request headers
 * @param {string} options.body - The request body
 * @param {string} options.note - Additional notes
 * @param {string} options.link - Documentation link
 * @returns {Object} - The data attribute object
 */
export function createDevModeAttr(options) {
  return {
    "data-dev-mode": JSON.stringify(options),
  }
}
