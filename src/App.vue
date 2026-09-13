<script setup lang="ts">
// `@` alias resolves to `src/` (see vite.config.ts + tsconfig.app.json paths)
import { useAppMeta } from '@/composables/useAppMeta'

const { title, tagline } = useAppMeta()
</script>

<template>
  <main class="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
    <h1 class="text-6xl font-extrabold tracking-tight text-white sm:text-7xl">
      {{ title }}<span class="text-accent">.</span>
    </h1>
    <p class="mt-4 max-w-md text-center text-lg text-muted">{{ tagline }}</p>

    <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
      <button
        class="rounded-lg bg-accent px-6 py-3 font-semibold text-white shadow-glow-accent transition-colors hover:bg-accent-400"
      >
        Get Started
      </button>
      <button
        class="rounded-lg border border-white/10 px-6 py-3 font-semibold text-zinc-300 transition-colors hover:bg-surface"
      >
        Browse Trailers
      </button>
    </div>
  </main>
</template>
