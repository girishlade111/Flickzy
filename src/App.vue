<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-background font-sans text-white">
    <header
      :class="[
        'sticky top-0 z-50 border-b transition-all duration-300',
        'bg-background/80 backdrop-blur-md',
        isScrolled ? 'bg-background/95 border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]' : 'bg-background/80 border-transparent'
      ]"
    >
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        <RouterLink
          to="/"
          class="flex items-center gap-1 text-xl sm:text-2xl font-extrabold tracking-tight font-display"
          aria-label="Flickzy Home"
        >
          <span class="text-white">Flickzy</span>
          <span class="text-accent">.</span>
        </RouterLink>

        <div class="hidden md:flex md:items-center md:gap-4">
          <div class="relative">
            <button
              class="relative flex items-center gap-2 rounded-full bg-surface-light px-4 py-2 text-sm text-muted transition-all hover:bg-surface hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Search"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span class="hidden sm:inline">Search</span>
            </button>
          </div>

          <RouterLink
            to="/watchlist"
            class="hidden lg:flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-muted transition-all hover:bg-surface hover:text-white hover:border-white/20"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Watchlist</span>
          </RouterLink>

          <div class="relative" @click.outside="closeMobileMenu">
            <button
              @click="toggleMobileMenu"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-surface-light border border-white/5 transition-all hover:bg-surface hover:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Profile menu"
              aria-expanded="false"
            >
              <div class="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-teal flex items-center justify-center text-xs font-bold text-white">
                U
              </div>
            </button>

            <div v-show="isMobileMenuOpen" class="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-surface border border-white/5 shadow-elevated py-2 animate-slide-down" role="menu">
              <RouterLink
                to="/profile"
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:bg-surface-light hover:text-white"
                role="menuitem"
                @click="closeMobileMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </RouterLink>
              <RouterLink
                to="/settings"
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:bg-surface-light hover:text-white"
                role="menuitem"
                @click="closeMobileMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </RouterLink>
              <hr class="my-2 border-white/5" />
              <button
                class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-surface-light"
                role="menuitem"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <button
          class="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-surface-light border border-white/5 transition-all hover:bg-surface hover:border-white/10"
          @click="toggleMobileMenu"
          aria-label="Toggle menu"
          aria-expanded="false"
        >
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>

      <div
        v-show="isMobileMenuOpen"
        class="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-md animate-slide-down"
        @click="closeMobileMenu"
      >
        <div class="px-4 py-4 space-y-3">
          <div class="relative">
            <button class="w-full flex items-center gap-3 rounded-xl bg-surface-light px-4 py-3 text-left text-muted transition-all hover:bg-surface focus:outline-none focus:ring-2 focus:ring-accent">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search movies & shows</span>
            </button>
          </div>
          <RouterLink
            to="/watchlist"
            class="flex items-center gap-3 rounded-xl bg-surface-light px-4 py-3 text-sm font-medium text-muted transition-all hover:bg-surface hover:text-white"
            @click="closeMobileMenu"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>My Watchlist</span>
          </RouterLink>
          <RouterLink
            to="/profile"
            class="flex items-center gap-3 rounded-xl bg-surface-light px-4 py-3 text-sm font-medium text-muted transition-all hover:bg-surface hover:text-white"
            @click="closeMobileMenu"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile</span>
          </RouterLink>
          <RouterLink
            to="/settings"
            class="flex items-center gap-3 rounded-xl bg-surface-light px-4 py-3 text-sm font-medium text-muted transition-all hover:bg-surface hover:text-white"
            @click="closeMobileMenu"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </RouterLink>
        </div>
      </div>
    </header>

    <main class="pt-16 min-h-[calc(100vh-4rem)]">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slideDown 200ms ease-out;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>