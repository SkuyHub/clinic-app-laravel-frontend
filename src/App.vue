<script setup lang="ts">
import { onMounted } from 'vue'
import { Toaster } from 'vue-sonner'
import { auth } from '@/stores/auth'

const authStore = auth()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      await authStore.fetchProfile()
    } catch {
      // intentionally empty — http.ts interceptor owns the 401 response
    }
  }
})
</script>

<template>
  <RouterView />
  <Toaster position="top-right" :duration="3500" />
</template>