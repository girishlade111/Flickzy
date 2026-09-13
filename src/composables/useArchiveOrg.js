/**
 * Flickzy — Archive.org integration.
 * Fetches free / public-domain films from the Internet Archive's public API
 * (no API key required). This file is framework-pure (only uses global
 * `fetch`), so it can be called from any composable, store, or plain script.
 *
 * Endpoints:
 *   - Advanced search: https://archive.org/advancedsearch.php
 *   - Item metadata:   https://archive.org/metadata/{identifier}
 *   - Direct file URL:  https://archive.org/download/{identifier}/{filename}
 *   - Item thumbnail:   https://archive.org/services/img/{identifier}
 */

/**
 * Unified content-model shape (defined in Prompt 4). Every Archive.org item
 * is mapped into this shape with `source: 'archive'`.
 *
 * @typedef {Object} UnifiedContentItem
 * @property {string} id             Unique id, e.g. `archive:identifier`
 * @property {string} source         Provenance — always `'archive'` here
 * @property {string} identifier     Archive.org item identifier
 * @property {string} title          Display title
 * @property {string} description    Short synopsis / description
 * @property {number|null} year      Release year
 * @property {string[]} creators     Directors / creators / cast
 * @property {string[]} genres       Genres / subjects
 * @property {number|null} rating    Score on a 0–10 scale (may be null)
 * @property {number|null} durationSeconds  Runtime in seconds (may be null)
 * @property {number} downloads      Popularity proxy from Archive.org
 * @property {string} thumbnail      Poster / thumbnail URL
 * @property {string} poster         Poster URL
 * @property {string} backdrop       Backdrop URL (same source for Archive)
 * @property {string} fileUrl        Direct, playable (.mp4) URL
 * @property {string} mediatype      Always `'movies'`
 */

/* ------------------------------------------------------------------ *
 * Configuration & caches
 * ------------------------------------------------------------------ */
const API_BASE = {
  search: 'https://archive.org/advancedsearch.php',
  metadata: (id) => `https://archive.org/metadata/${encodeURIComponent(id)}`,
  download: (id, name) =>
    `https://archive.org/download/${encodeURIComponent(id)}/${name
      .split('/')
      .map(encodeURIComponent)
      .join('/')}`,
  thumbnail: (id) => `https://archive.org/services/img/${encodeURIComponent(id)}`,
}

/** Flat fields requested from the advanced-search endpoint. */
const SEARCH_FIELDS = [
  'identifier',
  'title',
  'description',
  'year',
  'creator',
  'subject',
  'duration',
  'mediatype',
  'downloads',
  'avg_rating',
  'num_reviews',
]

const DEFAULT_ROWS = 20

// Promise-valued caches so concurrent calls for the same key share one request.
const searchCache = new Map() // key: `${collection}|${query}` -> Promise<UnifiedContentItem[]>
const itemCache = new Map() // key: identifier -> Promise<UnifiedContentItem|null>

/** @type {typeof fetch} Overridable for tests; defaults to global fetch. */
let fetcher = typeof globalThis !== 'undefined' ? globalThis.fetch : undefined

/**
 * Swap in a custom fetch implementation (useful for unit tests / mocking).
 * @param {typeof fetch} fn
 */
export function setArchiveFetcher(fn) {
  fetcher = fn
}

/** Drop all cached search results and item details. */
export function clearArchiveCache() {
  searchCache.clear()
  itemCache.clear()
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

/**
 * Build the advanced-search URL with proper query params.
 * @param {string} query
 * @param {string} collection
 * @param {number} rows
 * @returns {string}
 */
function buildSearchUrl(query, collection, rows) {
  const filters = ['mediatype:movies']
  if (collection) filters.push(`collection:${collection}`)

  const q = [String(query).trim(), ...filters].filter(Boolean).join(' AND ')

  const params = new URLSearchParams()
  params.set('q', q)
  params.set('rows', String(rows))
  params.set('page', '1')
  params.set('output', 'json')
  for (const field of SEARCH_FIELDS) params.append('fl[]', field)

  return `${API_BASE.search}?${params.toString()}`
}

/**
 * Pick the best playable `.mp4` file from an item's `files` array.
 * Non-mp4 files (thumbnails, playlists, xml), empty/zero-byte files and
 * derivative-only entries are all skipped.
 *
 * @param {string} identifier
 * @param {Array<{name: string, format?: string, length?: string}>|undefined} files
 * @returns {{name: string, url: string}|null}
 */
export function extractVideoFile(identifier, files) {
  if (!Array.isArray(files)) return null

  const best = files
    .filter((f) => f && typeof f.name === 'string')
    .filter((f) => f.name.toLowerCase().endsWith('.mp4'))
    .filter((f) => {
      const length = Number(f.length)
      return Number.isFinite(length) && length > 0
    })
    .sort((a, b) => Number(b.length) - Number(a.length))[0]

  if (!best) return null

  return { name: best.name, url: API_BASE.download(identifier, best.name) }
}

/* ------------------------------------------------------------------ *
 * Public API
 * ------------------------------------------------------------------ */

/**
 * Fetch full metadata + a direct playable (.mp4) URL for a specific item.
 * Returns `null` when the item has no valid video file or the request fails.
 *
 * @param {string} identifier Archive.org item identifier
 * @returns {Promise<UnifiedContentItem|null>}
 */
export async function getArchiveItemDetails(identifier) {
  if (!identifier || typeof identifier !== 'string') return null

  if (itemCache.has(identifier)) return itemCache.get(identifier)

  const promise = (async () => {
    try {
      const res = await fetcher(API_BASE.metadata(identifier))
      if (!res.ok) {
        console.warn(`[useArchiveOrg] Metadata request failed (${res.status}) for "${identifier}"`)
        return null
      }

      const data = await res.json()
      const meta = data && data.metadata ? data.metadata : {}

      // Filter the `files` array for a playable .mp4 and bail out if none.
      const video = extractVideoFile(identifier, data && data.files)
      if (!video) {
        console.warn(`[useArchiveOrg] No playable .mp4 for "${identifier}" — skipping`)
        return null
      }

      return mapItem(meta, data, video)
    } catch (error) {
      console.warn(`[useArchiveOrg] Failed to load details for "${identifier}":`, error)
      return null
    }
  })()

  itemCache.set(identifier, promise)
  return promise
}

/**
 * Search Archive.org's free film archive and map results into the unified
 * content-model shape (`source: 'archive'`).
 *
 * Items with no valid videofile are filtered out, so every returned item
 * has a working `fileUrl`. Failed / empty responses degrade gracefully to
 * `[]` (with a console warning) instead of throwing.
 *
 * @param {string} query Free-text search terms, e.g. `'classic sci-fi'`
 * @param {string} [collection='moviesandfilms'] Collection filter
 * @param {{rows?: number, concurrency?: number}} [options]
 * @returns {Promise<UnifiedContentItem[]>}
 */
export function searchArchiveMovies(query, collection = 'moviesandfilms', options = {}) {
  const rows =
    Number.isFinite(options.rows) && options.rows > 0 ? Math.floor(options.rows) : DEFAULT_ROWS
  const concurrency =
    Number.isFinite(options.concurrency) && options.concurrency > 0
      ? Math.floor(options.concurrency)
      : 6

  const key = `${collection}|${String(query).trim()}`
  if (searchCache.has(key)) return searchCache.get(key)

  const promise = (async () => {
    try {
      const res = await fetcher(buildSearchUrl(query, collection, rows))
      if (!res.ok) {
        console.warn(`[useArchiveOrg] Search request failed with status ${res.status}`)
        return []
      }

      const data = await res.json()
      const docs = data && data.response && data.response.docs
      if (!Array.isArray(docs) || docs.length === 0) {
        console.warn('[useArchiveOrg] Search returned no documents')
        return []
      }

      // Fetch details per item in a small worker pool (to be polite to the API)
      // so we can resolve each item's playable .mp4 fileUrl.
      const mapped = []
      const queue = [...docs]
      let cursor = 0

      const worker = async () => {
        while (cursor < queue.length) {
          const doc = queue[cursor++]
          if (!doc || !doc.identifier) continue
          const item = await getArchiveItemDetails(doc.identifier)
          if (item) mapped.push(item)
        }
      }

      await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, () => worker()))

      console.info(`[useArchiveOrg] Search "${query}" → ${mapped.length} playable result(s)`)
      return mapped
    } catch (error) {
      console.warn('[useArchiveOrg] Search failed:', error)
      return []
    }
  })()

  searchCache.set(key, promise)
  return promise
}

/* ------------------------------------------------------------------ *
 * Mapping helpers (internal)
 * ------------------------------------------------------------------ */

/**
 * Map raw Archive.org metadata + chosen video file into the unified shape.
 * @param {Record<string, any>} meta
 * @param {Record<string, any>} data
 * @param {{name: string, url: string}} video
 * @returns {UnifiedContentItem}
 */
function mapItem(meta, data, video) {
  const identifier = String(meta.identifier || (data && data.dir) || '')
  const thumb = API_BASE.thumbnail(identifier)
  const description = Array.isArray(meta.description) ? meta.description[0] : meta.description

  return {
    id: `archive:${identifier}`,
    source: 'archive',
    identifier,
    title: String(meta.title || identifier),
    description: typeof description === 'string' ? description : '',
    year: toInt(meta.year),
    creators: toArray(meta.creator),
    genres: toArray(meta.subject),
    rating: toRating(meta.avg_rating),
    durationSeconds: toInt(meta.duration),
    downloads: toInt(meta.downloads) || 0,
    thumbnail: thumb,
    poster: thumb,
    backdrop: thumb,
    fileUrl: video.url,
    mediatype: 'movies',
  }
}

/** Normalize a value into a string array (Archive returns scalar or array). */
function toArray(value) {
  if (value == null) return []
  return (Array.isArray(value) ? value : [value]).map(String).filter(Boolean)
}

/** Parse an integer, returning `null` on garbage (Archive mixes types). */
function toInt(value) {
  const parsed = parseInt(String(value), 10)
  return Number.isFinite(parsed) ? parsed : null
}

/** Archive's avg_rating is already 0–10; clamp + round to 1 decimal. */
function toRating(value) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return Math.round(Math.min(parsed, 10) * 10) / 10
}
