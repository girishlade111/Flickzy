/**
 * Flickzy — Pinia catalog store.
 *
 * Manages the full content catalog. On init the store is populated from the
 * curated seed catalog (Prompt 7) plus whatever has been cached into IndexedDB
 * during earlier sessions, then enriched live via Archive.org searches.
 *
 * Live Archive.org results are written back to the `catalogCache` object store
 * (via `src/db/index.js`) so they can be restored instantly on the next load
 * without refetching.
 *
 * State:
 *   - items         Full catalog array (seed + cached + live search results)
 *   - loading       True while an async action is in flight
 *   - error         Last error message, null when healthy
 *   - searchQuery   Active free-text search
 *   - selectedGenre Active genre id
 *
 * Getters:
 *   - filteredItems  Items narrowed by the active genre and/or search query
 *   - trendingItems  Fixed popular subset for the hero row
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { seedCatalog } from '@/data/seedCatalog'
import { genreMap } from '@/data/genres'
import { getAll, updateItem } from '@/db/index'
import { searchArchiveMovies } from '@/composables/useArchiveOrg'

/** IndexedDB object store that persists fetched Archive.org results. */
const CACHE_STORE = 'catalogCache'
/** Number of items surfaced in the hero/trending row. */
const TRENDING_LIMIT = 8

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

/** Merge arrays, keeping the last occurrence of each unique `id`. */
function mergeUnique(...collections) {
  const map = new Map()
  for (const collection of collections) {
    for (const item of collection) {
      if (item && typeof item.id === 'string' && item.id !== '') map.set(item.id, item)
    }
  }
  return Array.from(map.values())
}

/** Return a numeric value, falling back to 0 when not a finite number. */
function toNumber(value) {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

/** Collect an item's genre values regardless of whether they use `genre` or `genres`. */
function itemGenres(item) {
  const values = []
  if (Array.isArray(item.genre)) values.push(...item.genre)
  if (Array.isArray(item.genres)) values.push(...item.genres)
  return values.map(String).map((v) => v.toLowerCase()).filter(Boolean)
}

/** True when the item belongs to the given genre (id or its human label). */
function matchesGenre(item, genreId) {
  if (!genreId) return true
  const id = String(genreId).toLowerCase()
  const label = genreMap[id] ? genreMap[id].toLowerCase() : ''
  const targets = [id, label].filter(Boolean)
  return itemGenres(item).some((value) => {
    if (value === id) return true
    if (label && value === label) return true
    return targets.some((target) => value.includes(target))
  })
}

/** True when a search query appears in the item's searchable text. */
function matchesQuery(item, query) {
  const q = String(query || '').trim().toLowerCase()
  if (!q) return true
  const haystack = [
    item.title,
    item.description,
    item.creator,
    item.creators,
    item.genre,
    item.genres,
    item.sourceId,
    item.identifier,
  ]
    .flat()
    .filter((v) => v != null)
    .map((v) => String(v).toLowerCase())
    .join(' ')
  return haystack.includes(q)
}

/** Deterministic popularity proxy used to rank the trending row. */
function popularityScore(item) {
  const downloads = toNumber(item.downloads)
  if (downloads > 0) return downloads
  return toNumber(item.rating)
}

/* ------------------------------------------------------------------ *
 * Store
 * ------------------------------------------------------------------ */

export const useCatalogStore = defineStore('catalog', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const selectedGenre = ref(null)

  /**
   * Populate the catalog from the seed data plus anything already cached in
   * IndexedDB, so a reload does not have to refetch from the network.
   */
  async function loadCatalog() {
    loading.value = true
    error.value = null
    try {
      let cached = []
      try {
        cached = await getAll(CACHE_STORE)
      } catch (cacheError) {
        console.warn('[catalog] Could not read IndexedDB cache:', cacheError)
      }
      items.value = mergeUnique(items.value, seedCatalog, cached)
    } catch (err) {
      error.value = String(err.message || err)
      console.warn('[catalog] loadCatalog failed:', err)
    } finally {
      loading.value = false
    }
  }

  /** Persist freshly fetched results so the next load can skip refetching. */
  async function persistResults(results) {
    for (const item of results) {
      try {
        await updateItem(CACHE_STORE, item)
      } catch (cacheError) {
        console.warn(`[catalog] Could not cache "${item.id}":`, cacheError)
      }
    }
  }

  /**
   * Update the active search query, fetch live matches from Archive.org,
   * cache and merge them with the existing (local + previously cached) items.
   * `filteredItems` reacts immediately once the query/state is set.
   */
  async function searchCatalog(query) {
    const normalized = String(query || '').trim()
    searchQuery.value = normalized

    if (!normalized) {
      error.value = null
      return
    }

    loading.value = true
    error.value = null
    try {
      const results = await searchArchiveMovies(normalized)
      if (results.length > 0) await persistResults(results)
      items.value = mergeUnique(items.value, results)
    } catch (err) {
      error.value = String(err.message || err)
      console.warn('[catalog] searchCatalog failed:', err)
    } finally {
      loading.value = false
    }
  }

  /** Set (or clear, with `null`) the active genre filter. */
  function filterByGenre(genreId) {
    selectedGenre.value = genreId ? String(genreId) : null
  }

  /** Items narrowed by the active genre filter and/or search query. */
  const filteredItems = computed(() => {
    const genreActive = !!selectedGenre.value
    const queryActive = !!searchQuery.value.trim()
    return items.value.filter((item) => {
      const genreOk = genreActive ? matchesGenre(item, selectedGenre.value) : true
      const queryOk = queryActive ? matchesQuery(item, searchQuery.value) : true
      return genreOk && queryOk
    })
  })

  /** Fixed, deterministic popular subset for the hero row. */
  const trendingItems = computed(() => {
    return items.value
      .slice()
      .sort((a, b) => popularityScore(b) - popularityScore(a))
      .slice(0, TRENDING_LIMIT)
  })

  return {
    items,
    loading,
    error,
    searchQuery,
    selectedGenre,
    loadCatalog,
    searchCatalog,
    filterByGenre,
    filteredItems,
    trendingItems,
  }
})