<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfilesStore } from '@/stores/profiles'
import ProfileFormModal from '@/components/ProfileFormModal.vue'
import type { Profile } from '@/db/db'

const router = useRouter()
const profilesStore = useProfilesStore()

const showProfileModal = ref(false)
const editingProfile = ref<Profile | null>(null)

onMounted(async () => {
  await profilesStore.load()
  if (profilesStore.activeProfile) {
    router.replace('/home')
  }
})

async function selectProfile(profile: Profile) {
  profilesStore.setActiveProfile(profile)
  await router.push('/home')
}

function openCreateProfile() {
  editingProfile.value = null
  showProfileModal.value = true
}

function openEditProfile(profile: Profile) {
  editingProfile.value = profile
  showProfileModal.value = true
}

async function handleDeleteProfile(profile: Profile) {
  if (!confirm(`Delete "${profile.name}"? This will remove all watch progress for this profile.`)) {
    return
  }
  await profilesStore.deleteProfile(profile.id)
}

async function handleModalSave(savedProfile: Profile) {
  // If creating new profile, set as active and navigate
  if (!editingProfile.value) {
    profilesStore.setActiveProfile(savedProfile)
    await router.push('/home')
  }
}
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-5xl">
      <!-- Header -->
      <header class="mb-12 text-center">
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-white mb-4">
          Who's Watching?
        </h1>
        <p class="text-muted text-lg max-w-md mx-auto">
          Pick a profile to start watching. Profiles are stored locally in your browser.
        </p>
      </header>

      <!-- Profiles Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8" role="list" aria-label="Profiles">
        <!-- Existing Profiles -->
        <template v-for="profile in profilesStore.profiles" :key="profile.id">
          <div class="relative group">
            <button
              @click="selectProfile(profile)"
              class="w-full flex flex-col items-center p-6 rounded-2xl bg-surface border border-white/5 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_0_24px_rgba(139,92,246,0.2)] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
              role="listitem"
              :aria-label="`Select ${profile.name}'s profile`"
            >
              <!-- Avatar -->
              <div
                class="relative w-24 h-24 sm:w-28 sm:h-28 mb-4 rounded-full bg-gradient-to-br from-accent to-teal flex items-center justify-center text-4xl sm:text-5xl overflow-hidden"
                :style="{ background: `linear-gradient(135deg, hsl(${Math.abs(profile.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 360}, 70%, 50%), hsl(${(Math.abs(profile.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) + 60) % 360}, 70%, 40%))` }"
              >
                <span class="text-white filter drop-shadow-lg">{{ profile.avatar }}</span>
              </div>

              <!-- Name -->
              <span class="text-lg font-semibold text-white group-hover:text-accent transition-colors text-center truncate w-full px-2">
                {{ profile.name }}
              </span>

              <!-- Kids badge -->
              <span v-if="profile.isKids" class="mt-1.5 px-2 py-0.5 text-xs font-medium bg-teal/20 text-teal rounded-full">
                Kids
              </span>
            </button>

            <!-- Edit/Delete menu (show on hover/focus) -->
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex gap-1">
              <button
                @click.stop="openEditProfile(profile)"
                class="p-2 rounded-xl bg-background/80 backdrop-blur text-muted hover:text-white hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Edit profile"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click.stop="handleDeleteProfile(profile)"
                class="p-2 rounded-xl bg-background/80 backdrop-blur text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Delete profile"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </template>

        <!-- Add Profile Tile (disabled if max reached) -->
        <button
          @click="openCreateProfile"
          v-if="!profilesStore.isMaxProfiles"
          class="group relative flex flex-col items-center p-6 rounded-2xl bg-surface border-2 border-dashed border-white/10 transition-all duration-300 hover:border-accent/50 hover:bg-surface-light hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          role="listitem"
          aria-label="Add a new profile"
        >
          <div class="relative w-24 h-24 sm:w-28 sm:h-28 mb-4 rounded-full bg-surface-light flex items-center justify-center transition-colors group-hover:bg-accent/20">
            <svg class="w-10 h-10 sm:w-12 sm:h-12 text-muted group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span class="text-lg font-semibold text-muted group-hover:text-accent transition-colors">Add Profile</span>
        </button>

        <!-- Max Profiles Reached Tile -->
        <div v-else class="relative flex flex-col items-center p-6 rounded-2xl bg-surface border-2 border-dashed border-white/5">
          <div class="relative w-24 h-24 sm:w-28 sm:h-28 mb-4 rounded-full bg-surface-light flex items-center justify-center">
            <svg class="w-10 h-10 sm:w-12 sm:h-12 text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span class="text-lg font-semibold text-muted/60">Max Profiles</span>
          <p class="text-xs text-muted/50 text-center mt-1 px-2">Limit of 5 reached</p>
        </div>
      </div>

      <!-- Empty State (no profiles at all) -->
      <div v-if="profilesStore.profiles.length === 0" class="text-center py-12 animate-fade-in">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-surface-light flex items-center justify-center text-5xl">
          👤
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">No Profiles Yet</h2>
        <p class="text-muted mb-6 max-w-md mx-auto">
          Create your first profile to start building your watchlist and tracking progress.
        </p>
        <button
          @click="openCreateProfile"
          class="px-8 py-3 rounded-xl bg-accent text-white font-medium transition-all hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
        >
          Create Profile
        </button>
      </div>

      <!-- Footer hint -->
      <p class="text-center text-xs text-muted/60">
        Profiles are saved locally in your browser. No account needed. Max {{ profilesStore.MAX_PROFILES }} profiles.
      </p>

      <!-- Profile Form Modal -->
      <ProfileFormModal
        v-model="showProfileModal"
        :editing-profile="editingProfile"
        @save="handleModalSave"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 400ms ease-out;
}
</style>