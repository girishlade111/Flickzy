import { createRouter, createWebHistory } from 'vue-router'
import { useProfilesStore } from '@/stores/profiles'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'profile-select',
      component: () => import('@/views/ProfileSelectView.vue'),
      meta: { requiresProfile: false },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresProfile: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { requiresProfile: true },
    },
    {
      path: '/watchlist',
      name: 'watchlist',
      component: () => import('@/views/WatchlistView.vue'),
      meta: { requiresProfile: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresProfile: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresProfile: true },
    },
  ],
})

/** Navigation guard: redirect to profile select if no active profile. */
router.beforeEach(async (to, _from, next) => {
  const profilesStore = useProfilesStore()

  // Load profiles if not already loaded
  if (profilesStore.profiles.length === 0 && !profilesStore.loading) {
    await profilesStore.load()
  }

  const requiresProfile = to.meta.requiresProfile !== false

  if (requiresProfile && !profilesStore.activeProfile) {
    // If profiles exist but none active, redirect to profile select
    if (profilesStore.profiles.length > 0) {
      next({ name: 'profile-select' })
    } else {
      // No profiles at all, allow access to profile-select
      next()
    }
  } else if (to.name === 'profile-select' && profilesStore.activeProfile) {
    // Already have active profile, redirect to home
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router