<script setup lang="ts">
import { useProfilesStore } from '@/stores/profiles'
import { useRouter } from 'vue-router'

const profilesStore = useProfilesStore()
const router = useRouter()

async function handleSignOut() {
  profilesStore.clearActive()
  await router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-background py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <header class="mb-8">
        <h1 class="text-3xl font-extrabold font-display text-white mb-2">Profile</h1>
        <p class="text-muted">Manage your profile settings</p>
      </header>

      <div v-if="profilesStore.activeProfile" class="space-y-6">
        <!-- Current Profile Card -->
        <div class="bg-surface border border-white/5 rounded-2xl p-6 flex items-center gap-6">
          <div
            class="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-teal flex items-center justify-center text-4xl"
            :style="{ background: `linear-gradient(135deg, hsl(${Math.abs(profilesStore.activeProfile.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 360}, 70%, 50%), hsl(${(Math.abs(profilesStore.activeProfile.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) + 60) % 360}, 70%, 40%))` }"
          >
            <span class="text-white">{{ profilesStore.activeProfile.avatar }}</span>
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-white">{{ profilesStore.activeProfile.name }}</h2>
            <p class="text-muted mt-1">{{ profilesStore.activeProfile.isKids ? 'Kids Profile' : 'Standard Profile' }}</p>
            <p class="text-xs text-muted/60 mt-2">Created {{ new Date(profilesStore.activeProfile.createdAt).toLocaleDateString() }}</p>
          </div>
        </div>

        <!-- Sign Out Button -->
        <button
          @click="handleSignOut"
          class="w-full px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-medium transition-all hover:bg-red-500/30 hover:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sign Out (Switch Profile)
        </button>
      </div>
    </div>
  </div>
</template>