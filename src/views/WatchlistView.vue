<script setup lang="ts">
import { useProfilesStore } from '@/stores/profiles'

const profilesStore = useProfilesStore()
</script>

<template>
  <div class="min-h-screen bg-background py-12 px-4">
    <div class="max-w-5xl mx-auto">
      <header class="mb-8">
        <h1 class="text-3xl font-extrabold font-display text-white mb-2">My Watchlist</h1>
        <p class="text-muted">Movies and shows you've saved for later</p>
      </header>

      <div v-if="profilesStore.activeProfile" class="text-center py-16">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-light flex items-center justify-center text-4xl">
          📋
        </div>
        <h2 class="text-xl font-semibold text-white mb-2">Watchlist Coming Soon</h2>
        <p class="text-muted max-w-md mx-auto">
          Your saved content will appear here. Add movies from the catalog to build your personal watchlist.
        </p>
      </div>
    </div>
  </div>
</template>