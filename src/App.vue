<script setup lang="ts">
  // App shell: sticky nav + routed views. `@` alias resolves to `src/`.
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-background font-sans text-white">
    <header class="sticky top-0 z-10 border-b border-white/5 bg-background/80 backdrop-blur">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <RouterLink to="/" class="text-xl font-extrabold tracking-tight">
          Flickzy<span class="text-accent">.</span>
        </RouterLink>

        <RouterLink
          to="/about"
          class="rounded-md border border-white/10 px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-white"
        >
          About
        </RouterLink>
      </nav>
    </header>

    <RouterView />
  </div>
</template>
