import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
  addProfile as addToDb,
  getProfiles as getFromDb,
  deleteProfileWithData,
  type Profile,
} from '@/db/db'

/** Preset avatar options (emoji-based, no upload needed). */
export const AVATAR_OPTIONS = [
  '👤', '👨', '👩', '🧑', '👦', '👧',
  '👴', '👵', '🦸', '🦹', '🧙', '🧝',
  '👽', '🤖', '🐱', '🐶', '🐼', '🦊',
  '🐯', '🦁', '🐰', '🐻', '🐨', '🐸',
] as const

/** Maximum number of profiles allowed (Netflix-style). */
export const MAX_PROFILES = 5

/** Generates a random avatar from the preset list. */
export function getRandomAvatar(): string {
  return AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)]
}

/** localStorage key for active profile ID. */
const ACTIVE_PROFILE_KEY = 'flickzy-active-profile-id'

/** Pinia store for managing user profiles (local-only, no auth). */
export const useProfilesStore = defineStore('profiles', () => {
  const profiles = ref<Profile[]>([])
  const activeProfile = ref<Profile | null>(null)
  const loading = ref(false)

  /** Loads all profiles from IndexedDB and rehydrates active profile. */
  async function load(): Promise<void> {
    loading.value = true
    try {
      profiles.value = await getFromDb()

      // Rehydrate active profile from localStorage
      const savedActiveId = localStorage.getItem(ACTIVE_PROFILE_KEY)
      if (savedActiveId) {
        const found = profiles.value.find(p => p.id === savedActiveId)
        if (found) {
          activeProfile.value = found
        } else {
          // Saved profile no longer exists, clear localStorage
          localStorage.removeItem(ACTIVE_PROFILE_KEY)
        }
      }
    } finally {
      loading.value = false
    }
  }

  /** Creates a new profile and persists it. */
  async function createProfile(name: string, avatar?: string, isKids = false): Promise<Profile> {
    if (profiles.value.length >= MAX_PROFILES) {
      throw new Error(`Maximum of ${MAX_PROFILES} profiles reached`)
    }

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

  /** Updates an existing profile. */
  async function updateProfile(id: string, changes: Partial<Pick<Profile, 'name' | 'avatar' | 'isKids'>>): Promise<void> {
    const profile = profiles.value.find(p => p.id === id)
    if (!profile) {
      throw new Error('Profile not found')
    }

    const updated: Profile = {
      ...profile,
      ...changes,
      name: changes.name?.trim() || profile.name,
    }
    await addToDb(updated) // put() upserts
    await load()

    // Update active profile reference if it was the one edited
    if (activeProfile.value?.id === id) {
      activeProfile.value = updated
    }
  }

  /** Deletes a profile and all associated data (watch progress). */
  async function deleteProfile(id: string): Promise<void> {
    const wasActive = activeProfile.value?.id === id

    await deleteProfileWithData(id)
    await load()

    if (wasActive) {
      activeProfile.value = null
      localStorage.removeItem(ACTIVE_PROFILE_KEY)
    }
  }

  /** Sets the active profile for the current session and persists to localStorage. */
  function setActiveProfile(profile: Profile): void {
    activeProfile.value = profile
    localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id)
  }

  /** Clears the active profile (logout). */
  function clearActive(): void {
    activeProfile.value = null
    localStorage.removeItem(ACTIVE_PROFILE_KEY)
  }

  /** Returns true if at least one profile exists. */
  const hasProfiles = computed(() => profiles.value.length > 0)

  /** Returns true if max profiles reached. */
  const isMaxProfiles = computed(() => profiles.value.length >= MAX_PROFILES)

  /** Returns the active profile or the first profile as fallback. */
  const currentProfile = computed(() => activeProfile.value || profiles.value[0] || null)

  /** Returns all profiles (alias for profiles). */
  const allProfiles = computed(() => profiles.value)

  // Watch for active profile changes to persist
  watch(activeProfile, (newProfile) => {
    if (newProfile) {
      localStorage.setItem(ACTIVE_PROFILE_KEY, newProfile.id)
    }
  })

  return {
    profiles,
    allProfiles,
    activeProfile,
    loading,
    hasProfiles,
    isMaxProfiles,
    currentProfile,
    MAX_PROFILES,
    load,
    createProfile,
    updateProfile,
    deleteProfile,
    setActiveProfile,
    clearActive,
    AVATAR_OPTIONS,
    getRandomAvatar,
  }
})