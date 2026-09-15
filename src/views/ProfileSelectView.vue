<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfilesStore } from '@/stores/profiles'
import type { Profile } from '@/db/db'

const router = useRouter()
const profilesStore = useProfilesStore()

const newProfileName = ref('')
const newProfileAvatar = ref(profilesStore.getRandomAvatar())
const newProfileKids = ref(false)
const showAddProfile = ref(false)
const isCreating = ref(false)

onMounted(async () => {
  await profilesStore.load()
  if (profilesStore.activeProfile) {
    router.replace('/home')
  }
})

async function selectProfile(profile: Profile) {
  profilesStore.setActive(profile)
  await router.push('/home')
}

async function handleCreateProfile() {
  const name = newProfileName.value.trim()
  if (!name || isCreating.value) return

  isCreating.value = true
  try {
    const profile = await profilesStore.create(name, newProfileAvatar.value, newProfileKids.value)
    profilesStore.setActive(profile)
    await router.push('/home')
  } finally {
    isCreating.value = false
    newProfileName.value = ''
    newProfileAvatar.value = profilesStore.getRandomAvatar()
    newProfileKids.value = false
    showAddProfile.value = false
  }
}

function cancelCreateProfile() {
  showAddProfile.value = false
  newProfileName.value = ''
  newProfileAvatar.value = profilesStore.getRandomAvatar()
  newProfileKids.value = false
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
          <button
            @click="selectProfile(profile)"
            class="group relative flex flex-col items-center p-6 rounded-2xl bg-surface border border-white/5 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_0_24px_rgba(139,92,246,0.2)] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
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
        </template>

        <!-- Add Profile Tile -->
        <button
          @click="showAddProfile = true"
          v-if="!showAddProfile"
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
      </div>

      <!-- Add Profile Form (replaces Add Profile tile) -->
      <div v-if="showAddProfile" class="max-w-md mx-auto mb-8 animate-slide-up">
        <div class="bg-surface border border-white/5 rounded-2xl p-6">
          <h2 class="text-xl font-bold text-white mb-4 text-center">Create Profile</h2>

          <div class="space-y-4">
            <div>
              <label for="profile-name" class="block text-sm font-medium text-muted mb-2">Profile Name</label>
              <input
                id="profile-name"
                v-model="newProfileName"
                @keyup.enter="handleCreateProfile"
                type="text"
                maxlength="20"
                placeholder="Enter name"
                class="w-full px-4 py-3 rounded-xl bg-background border border-white/10 text-white placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                autofocus
              />
              <p class="text-xs text-muted mt-1">{{ newProfileName.length }}/20 characters</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-muted mb-2">Choose Avatar</label>
              <div class="grid grid-cols-6 gap-3 max-h-40 overflow-y-auto pb-2">
                <button
                  v-for="avatar in profilesStore.AVATAR_OPTIONS"
                  :key="avatar"
                  type="button"
                  @click="newProfileAvatar = avatar"
                  class="relative w-12 h-12 rounded-full bg-surface-light flex items-center justify-center text-2xl transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent"
                  :class="{ 'ring-2 ring-accent scale-110': newProfileAvatar === avatar }"
                  :aria-label="`Select ${avatar} as avatar`"
                  :aria-pressed="newProfileAvatar === avatar"
                >
                  <span>{{ avatar }}</span>
                </button>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <input
                id="kids-profile"
                type="checkbox"
                v-model="newProfileKids"
                class="w-5 h-5 rounded border-white/20 text-accent bg-background focus:ring-accent"
              />
              <label for="kids-profile" class="text-sm text-muted cursor-pointer">Kids Profile (filtered content)</label>
            </div>

            <div class="flex gap-3 pt-2">
              <button
                @click="cancelCreateProfile"
                class="flex-1 px-4 py-3 rounded-xl bg-surface border border-white/10 text-muted font-medium transition-all hover:bg-surface-light hover:text-white hover:border-white/20"
                :disabled="isCreating"
              >
                Cancel
              </button>
              <button
                @click="handleCreateProfile"
                :disabled="!newProfileName.trim() || isCreating"
                class="flex-1 px-4 py-3 rounded-xl bg-accent text-white font-medium transition-all hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isCreating" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </span>
                <span v-else>Create Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State (no profiles at all) -->
      <div v-if="profilesStore.profiles.length === 0 && !showAddProfile" class="text-center py-12 animate-fade-in">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-surface-light flex items-center justify-center text-5xl">
          👤
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">No Profiles Yet</h2>
        <p class="text-muted mb-6 max-w-md mx-auto">
          Create your first profile to start building your watchlist and tracking progress.
        </p>
        <button
          @click="showAddProfile = true"
          class="px-8 py-3 rounded-xl bg-accent text-white font-medium transition-all hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
        >
          Create Profile
        </button>
      </div>

      <!-- Footer hint -->
      <p class="text-center text-xs text-muted/60">
        Profiles are saved locally in your browser. No account needed.
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slideUp 300ms ease-out;
}

.animate-fade-in {
  animation: fadeIn 400ms ease-out;
}

/* Scrollbar for avatar grid */
.max-h-40::-webkit-scrollbar {
  width: 6px;
}

.max-h-40::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-40::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.max-h-40::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>