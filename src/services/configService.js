const cache = new Map();

/**
 * Service to load and cache table configurations from the JSON files.
 * @param {string} tableId The unique identifier of the table (e.g. 'shipments')
 * @returns {Promise<Object>} A promise that resolves to the table configuration
 */
export const getTableConfig = async (tableId) => {
  if (cache.has(tableId)) {
    return cache.get(tableId);
  }

  try {
    // Vite will automatically create chunks for these JSON files and handle the import
    const module = await import(`../config/tables/${tableId}.json`);
    const config = module.default || module;
    cache.set(tableId, config);
    return config;
  } catch (error) {
    console.error(`Failed to load configuration for tableId: ${tableId}`, error);
    throw new Error(`Configuration not found for tableId: ${tableId}`);
  }
};
