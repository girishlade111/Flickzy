import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  addProfile as addToDb,
  removeProfile as removeFromDb,
  getProfiles as getFromDb,
  type Profile,
} from '@/db/db'

/** Preset avatar options (emoji-based, no upload needed). */
export const AVATAR_OPTIONS = [
  '👤', '👨', '👩', '🧑', '👦', '👧',
  '👴', '👵', '🦸', '🦹', '🧙', '🧝',
  '👽', '🤖', '🐱', '🐶', '🐼', '🦊',
  '🐯', '🦁', '🐰', '🐻', '🐨', '🐸',
] as const

/** Generates a random avatar from the preset list. */
export function getRandomAvatar(): string {
  return AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)]
}

/** Pinia store for managing user profiles (local-only, no auth). */
export const useProfilesStore = defineStore('profiles', () => {
  const profiles = ref<Profile[]>([])
  const activeProfile = ref<Profile | null>(null)
  const loading = ref(false)

  /** Loads all profiles from IndexedDB. */
  async function load(): Promise<void> {
    loading.value = true
    try {
      profiles.value = await getFromDb()
    } finally {
      loading.value = false
    }
  }

  /** Creates a new profile and persists it. */
  async function create(name: string, avatar?: string, isKids = false): Promise<Profile> {
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name: name.trim(),
      avatar: avatar || getRandomAvatar(),
      createdAt: Date.now(),
      isKids,
    }
    await addToDb(newProfile)
    await load()
    return newProfile
  }

  /** Deletes a profile by id. */
  async function deleteProfile(id: string): Promise<void> {
    await removeFromDb(id)
    await load()
    if (activeProfile.value?.id === id) {
      activeProfile.value = null
    }
  }

  /** Sets the active profile for the current session. */
  function setActive(profile: Profile): void {
    activeProfile.value = profile
  }

  /** Clears the active profile (logout). */
  function clearActive(): void {
    activeProfile.value = null
  }

  /** Returns true if at least one profile exists. */
  const hasProfiles = computed(() => profiles.value.length > 0)

  /** Returns the active profile or the first profile as fallback. */
  const currentProfile = computed(() => activeProfile.value || profiles.value[0] || null)

  return {
    profiles,
    activeProfile,
    loading,
    hasProfiles,
    currentProfile,
    load,
    create,
    deleteProfile,
    setActive,
    clearActive,
    AVATAR_OPTIONS,
    getRandomAvatar,
  }
})