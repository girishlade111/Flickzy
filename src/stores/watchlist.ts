import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  addToWatchlist as addToDb,
  getWatchlist as getFromDb,
  removeFromWatchlist as removeFromDb,
  type WatchlistItem,
} from '@/db/db'

/**
 * Pinia store that mirrors the IndexedDB `watchlist` store into reactive state.
 * The `idb` package handles all persistence under the hood.
 */
export const useWatchlistStore = defineStore('watchlist', () => {
  const items = ref<WatchlistItem[]>([])

  async function load(): Promise<void> {
    items.value = await getFromDb()
  }

  async function add(item: WatchlistItem): Promise<void> {
    await addToDb(item)
    await load()
  }

  async function remove(id: string): Promise<void> {
    await removeFromDb(id)
    await load()
  }

  return { items, load, add, remove }
})
