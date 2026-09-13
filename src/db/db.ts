import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

/**
 * Minimal typed schema for Flickzy's local IndexedDB database.
 * Currently only a `watchlist` object store (keyed by movie id).
 */
export interface WatchlistItem {
  id: string
  title: string
  poster?: string
  addedAt: number
}

interface FlickzyDB extends DBSchema {
  watchlist: {
    key: string
    value: WatchlistItem
  }
}

const DB_NAME = 'flickzy-db'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<FlickzyDB>> | null = null

/** Lazily opens (and caches) the Flickzy IndexedDB connection. */
export function getDb(): Promise<IDBPDatabase<FlickzyDB>> {
  if (!dbPromise) {
    dbPromise = openDB<FlickzyDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('watchlist')) {
          db.createObjectStore('watchlist', { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

/** Adds or updates a movie in the watchlist store. */
export async function addToWatchlist(item: WatchlistItem): Promise<void> {
  const db = await getDb()
  await db.put('watchlist', item)
}

/** Removes a movie from the watchlist store by id. */
export async function removeFromWatchlist(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('watchlist', id)
}

/** Fetches every item currently persisted in the watchlist store. */
export async function getWatchlist(): Promise<WatchlistItem[]> {
  const db = await getDb()
  return db.getAll('watchlist')
}
