<script setup lang="ts">
import { useProfilesStore } from '@/stores/profiles'

const profilesStore = useProfilesStore()
</script>

<template>
  <div class="min-h-screen bg-background py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <header class="mb-8">
        <h1 class="text-3xl font-extrabold font-display text-white mb-2">Settings</h1>
        <p class="text-muted">App preferences and information</p>
      </header>

      <div class="space-y-6">
        <!-- Profiles Section -->
        <section class="bg-surface border border-white/5 rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Profiles
          </h2>
          <p class="text-muted text-sm mb-4">{{ profilesStore.profiles.length }} profile(s) created</p>
          <router-link to="/profile" class="text-accent hover:text-accent-hover text-sm font-medium">
            Manage Profiles →
          </router-link>
        </section>

        <!-- Data Section -->
        <section class="bg-surface border border-white/5 rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            Data & Storage
          </h2>
          <p class="text-muted text-sm mb-4">All data is stored locally in your browser using IndexedDB.</p>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between text-muted">
              <span>Database</span>
              <span class="text-white font-mono">flickzy-db</span>
            </div>
            <div class="flex justify-between text-muted">
              <span>Profiles Store</span>
              <span class="text-white font-mono">{{ profilesStore.profiles.length }} records</span>
            </div>
          </div>
        </section>

        <!-- About Section -->
        <section class="bg-surface border border-white/5 rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </h2>
          <div class="space-y-2 text-sm text-muted">
            <div class="flex justify-between">
              <span>App Name</span>
              <span class="text-white">Flickzy</span>
            </div>
            <div class="flex justify-between">
              <span>Version</span>
              <span class="text-white">0.1.0</span>
            </div>
            <div class="flex justify-between">
              <span>Framework</span>
              <span class="text-white">Vue 3 + Vite + Tailwind</span>
            </div>
            <div class="flex justify-between">
              <span>Storage</span>
              <span class="text-white">IndexedDB (idb)</span>
            </div>
          </div>
        </section>

        <!-- Legal Links -->
        <section class="bg-surface border border-white/5 rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Legal
          </h2>
          <div class="space-y-2">
            <a href="#" class="text-sm text-muted hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" class="text-sm text-muted hover:text-accent transition-colors">Terms of Service</a>
            <a href="#" class="text-sm text-muted hover:text-accent transition-colors">Open Source Licenses</a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>