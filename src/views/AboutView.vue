<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useWatchlistStore } from '@/stores/watchlist'

  const watchlist = useWatchlistStore()

  onMounted(() => {
    watchlist.load()
  })
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-12">
    <h1 class="text-3xl font-bold tracking-tight">About Flickzy</h1>
    <p class="mt-3 max-w-prose text-muted">
      A premium movie &amp; trailer discovery app built with the modern Vue 3 stack: Vite, Vue
      Router, Pinia, Tailwind CSS, and IndexedDB (via the
      <code class="rounded bg-surface px-1.5 py-0.5 text-sm text-accent-300">idb</code> package).
    </p>

    <div class="mt-8 rounded-xl border border-white/10 bg-surface p-6">
      <p class="text-sm uppercase tracking-widest text-muted">Local Watchlist (IndexedDB)</p>
      <p class="mt-1 text-5xl font-extrabold text-accent">{{ watchlist.items.length }}</p>
      <p class="mt-2 text-sm text-muted">
        Movies saved to your watchlist persist across sessions via IndexedDB.
      </p>
    </div>
  </main>
</template>
