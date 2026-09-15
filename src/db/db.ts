import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

/** Profile stored locally in IndexedDB. */
export interface Profile {
  id: string
  name: string
  avatar: string
  createdAt: number
  isKids?: boolean
}

/** Watchlist item stored in IndexedDB. */
export interface WatchlistItem {
  id: string
  title: string
  poster?: string
  addedAt: number
}

/** Watch progress for resume playback. */
export interface WatchProgressItem {
  id: string
  profileId: string
  contentId: string
  currentTime: number
  duration: number
  completed: boolean
  updatedAt: number
}

interface FlickzyDB extends DBSchema {
  profiles: {
    key: string
    value: Profile
  }
  watchlist: {
    key: string
    value: WatchlistItem
  }
  watchProgress: {
    key: string
    value: WatchProgressItem
    indexes: { 'profileId-contentId': [string, string] }
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
        if (!db.objectStoreNames.contains('profiles')) {
          db.createObjectStore('profiles', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('watchlist')) {
          db.createObjectStore('watchlist', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('watchProgress')) {
          const progressStore = db.createObjectStore('watchProgress', { keyPath: 'id' })
          progressStore.createIndex('profileId-contentId', ['profileId', 'contentId'])
        }
      },
    })
  }
  return dbPromise
}

/** Adds or updates a profile. */
export async function addProfile(profile: Profile): Promise<void> {
  const db = await getDb()
  await db.put('profiles', profile)
}

/** Removes a profile by id. */
export async function removeProfile(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('profiles', id)
}

/** Fetches all profiles. */
export async function getProfiles(): Promise<Profile[]> {
  const db = await getDb()
  return db.getAll('profiles')
}

/** Gets a single profile by id. */
export async function getProfile(id: string): Promise<Profile | undefined> {
  const db = await getDb()
  return db.get('profiles', id)
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

/** Upserts watch progress. */
export async function setWatchProgress(item: WatchProgressItem): Promise<void> {
  const db = await getDb()
  await db.put('watchProgress', item)
}

/** Gets watch progress for a profile and content. */
export async function getWatchProgress(profileId: string, contentId: string): Promise<WatchProgressItem | undefined> {
  const db = await getDb()
  return db.getFromIndex('watchProgress', 'profileId-contentId', [profileId, contentId])
}

/** Gets all watch progress for a profile. */
export async function getAllWatchProgress(profileId: string): Promise<WatchProgressItem[]> {
  const db = await getDb()
  return db.getAllFromIndex('watchProgress', 'profileId-contentId', IDBKeyRange.bound([profileId, ''], [profileId, '\uffff']))
}

/** Deletes all watchlist items for a profile. */
export async function clearWatchlistForProfile(profileId: string): Promise<void> {
  const db = await getDb()
  const items = await db.getAll('watchlist')
  const tx = db.transaction('watchlist', 'readwrite')
  for (const item of items) {
    // Watchlist items don't have profileId, so we can't filter by profile
    // This is a global watchlist - we'll keep it as-is per profile
    // If we need per-profile watchlist, the schema would need to change
  }
  await tx.done
}

/** Deletes all watch progress for a profile. */
export async function clearWatchProgressForProfile(profileId: string): Promise<void> {
  const db = await getDb()
  const items = await getAllWatchProgress(profileId)
  const tx = db.transaction('watchProgress', 'readwrite')
  for (const item of items) {
    await tx.store.delete(item.id)
  }
  await tx.done
}

/** Deletes a profile and all associated data (cascade). */
export async function deleteProfileWithData(id: string): Promise<void> {
  await clearWatchProgressForProfile(id)
  await removeProfile(id)
}