import { openDB } from 'idb'

const DB_NAME = 'flickzy-db'
const DB_VERSION = 1

let dbInstance = null

async function initDB() {
  if (dbInstance) return dbInstance

  try {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('profiles')) {
          db.createObjectStore('profiles', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('watchlist')) {
          const watchlistStore = db.createObjectStore('watchlist', { keyPath: 'id' })
          watchlistStore.createIndex('profileId', 'profileId')
        }
        if (!db.objectStoreNames.contains('watchProgress')) {
          const progressStore = db.createObjectStore('watchProgress', { keyPath: 'id' })
          progressStore.createIndex('profileId_contentId', ['profileId', 'contentId'])
        }
        if (!db.objectStoreNames.contains('catalogCache')) {
          db.createObjectStore('catalogCache', { keyPath: 'id' })
        }
      },
    })
    return dbInstance
  } catch (error) {
    throw new Error(`Failed to initialize IndexedDB: ${error.message}`)
  }
}

export async function getDB() {
  return initDB()
}

export async function addItem(storeName, item) {
  try {
    const db = await initDB()
    return await db.add(storeName, item)
  } catch (error) {
    throw new Error(`Failed to add item to ${storeName}: ${error.message}`)
  }
}

export async function getItem(storeName, id) {
  try {
    const db = await initDB()
    return await db.get(storeName, id)
  } catch (error) {
    throw new Error(`Failed to get item from ${storeName}: ${error.message}`)
  }
}

export async function getAllByIndex(storeName, indexName, value) {
  try {
    const db = await initDB()
    return await db.getAllFromIndex(storeName, indexName, value)
  } catch (error) {
    throw new Error(`Failed to get items by index from ${storeName}: ${error.message}`)
  }
}

export async function deleteItem(storeName, id) {
  try {
    const db = await initDB()
    await db.delete(storeName, id)
  } catch (error) {
    throw new Error(`Failed to delete item from ${storeName}: ${error.message}`)
  }
}

export async function updateItem(storeName, item) {
  try {
    const db = await initDB()
    return await db.put(storeName, item)
  } catch (error) {
    throw new Error(`Failed to update item in ${storeName}: ${error.message}`)
  }
}

export async function clearStore(storeName) {
  try {
    const db = await initDB()
    await db.clear(storeName)
  } catch (error) {
    throw new Error(`Failed to clear ${storeName}: ${error.message}`)
  }
}

export async function getAll(storeName) {
  try {
    const db = await initDB()
    return await db.getAll(storeName)
  } catch (error) {
    throw new Error(`Failed to get all items from ${storeName}: ${error.message}`)
  }
}
