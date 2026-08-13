/**
 * Simple in-memory cache utility.
 * Stores data with a TTL (time-to-live) in seconds.
 * No external dependencies needed — pure Node.js.
 */

const store = new Map();

/**
 * Get a cached value.
 * @param {string} key
 * @returns {any|null} cached value or null if expired/missing
 */
function get(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

/**
 * Set a cache value.
 * @param {string} key
 * @param {any} value
 * @param {number} ttlSeconds - how long to cache (default: 5 minutes)
 */
function set(key, value, ttlSeconds = 300) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/**
 * Invalidate (delete) a cache key.
 * Call this whenever data is updated/created/deleted.
 * @param {string} key
 */
function invalidate(key) {
  store.delete(key);
}

/**
 * Invalidate all keys that start with a prefix.
 * Useful for clearing all review-related caches at once.
 * @param {string} prefix
 */
function invalidatePrefix(prefix) {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}

module.exports = { get, set, invalidate, invalidatePrefix };
