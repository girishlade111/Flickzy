<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useProfilesStore } from '@/stores/profiles'
import type { Profile } from '@/db/db'

interface Props {
  modelValue: boolean
  editingProfile?: Profile | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', profile: Profile): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const profilesStore = useProfilesStore()

const formName = ref('')
const formAvatar = ref(profilesStore.getRandomAvatar())
const formIsKids = ref(false)
const isSubmitting = ref(false)
const error = ref('')

watch(() => props.modelValue, (open) => {
  if (open) {
    if (props.editingProfile) {
      formName.value = props.editingProfile.name
      formAvatar.value = props.editingProfile.avatar
      formIsKids.value = props.editingProfile.isKids || false
    } else {
      formName.value = ''
      formAvatar.value = profilesStore.getRandomAvatar()
      formIsKids.value = false
    }
    error.value = ''
    nextTick(() => {
      nameInput.value?.focus()
    })
  }
})

const nameInput = ref<HTMLInputElement | null>(null)

function handleClose() {
  emit('update:modelValue', false)
}

async function handleSave() {
  const name = formName.value.trim()
  if (!name) {
    error.value = 'Please enter a name'
    return
  }
  if (name.length > 20) {
    error.value = 'Name must be 20 characters or less'
    return
  }

  isSubmitting.value = true
  error.value = ''

  try {
    if (props.editingProfile) {
      await profilesStore.updateProfile(props.editingProfile.id, {
        name,
        avatar: formAvatar.value,
        isKids: formIsKids.value,
      })
      const updated = profilesStore.profiles.find(p => p.id === props.editingProfile!.id)
      if (updated) emit('save', updated)
    } else {
      const profile = await profilesStore.createProfile(name, formAvatar.value, formIsKids.value)
      emit('save', profile)
    }
    emit('update:modelValue', false)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to save profile'
  } finally {
    isSubmitting.value = false
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') handleClose()
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSave()
  }
}
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center px-4 py-8" @click.self="handleClose">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      <!-- Modal -->
      <div
        class="relative w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-elevated overflow-hidden animate-slide-up"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="editingProfile ? 'edit-profile-title' : 'create-profile-title'"
      >
        <!-- Header -->
        <header class="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2
            :id="editingProfile ? 'edit-profile-title' : 'create-profile-title'"
            class="text-xl font-bold text-white"
          >
            {{ editingProfile ? 'Edit Profile' : 'Create Profile' }}
          </h2>
          <button
            @click="handleClose"
            class="p-2 rounded-xl text-muted hover:text-white hover:bg-surface-light transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Close"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <!-- Form -->
        <form @submit.prevent="handleSave" class="p-6 space-y-5">
          <!-- Error message -->
          <div v-if="error" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
            {{ error }}
          </div>

          <!-- Name input -->
          <div>
            <label for="profile-name" class="block text-sm font-medium text-muted mb-2">Profile Name</label>
            <input
              ref="nameInput"
              id="profile-name"
              v-model="formName"
              type="text"
              maxlength="20"
              placeholder="Enter name"
              class="w-full px-4 py-3 rounded-xl bg-background border border-white/10 text-white placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              @keydown="handleKeydown"
              autocomplete="off"
            />
            <p class="text-xs text-muted mt-1 text-right">{{ formName.length }}/20</p>
          </div>

          <!-- Avatar picker -->
          <div>
            <label class="block text-sm font-medium text-muted mb-2">Choose Avatar</label>
            <div class="grid grid-cols-6 gap-3 max-h-40 overflow-y-auto pb-2">
              <button
                v-for="avatar in profilesStore.AVATAR_OPTIONS"
                :key="avatar"
                type="button"
                @click="formAvatar = avatar"
                class="relative w-12 h-12 rounded-full bg-surface-light flex items-center justify-center text-2xl transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent"
                :class="{ 'ring-2 ring-accent scale-110': formAvatar === avatar }"
                :aria-label="`Select ${avatar} as avatar`"
                :aria-pressed="formAvatar === avatar"
              >
                <span>{{ avatar }}</span>
              </button>
            </div>
          </div>

          <!-- Kids profile toggle -->
          <div class="flex items-center gap-3">
            <input
              id="kids-profile"
              type="checkbox"
              v-model="formIsKids"
              class="w-5 h-5 rounded border-white/20 text-accent bg-background focus:ring-accent"
            />
            <label for="kids-profile" class="text-sm text-muted cursor-pointer">Kids Profile (filtered content)</label>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="handleClose"
              class="flex-1 px-4 py-3 rounded-xl bg-surface border border-white/10 text-muted font-medium transition-all hover:bg-surface-light hover:text-white hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-accent"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-3 rounded-xl bg-accent text-white font-medium transition-all hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isSubmitting || !formName.trim()"
            >
              <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {{ editingProfile ? 'Saving...' : 'Creating...' }}
              </span>
              <span v-else>{{ editingProfile ? 'Save Changes' : 'Create Profile' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-fade-enter-active {
  animation: modalFadeIn 200ms ease-out;
}

.modal-fade-leave-active {
  animation: modalFadeOut 150ms ease-in;
}

@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalFadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.animate-slide-up {
  animation: slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1);
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