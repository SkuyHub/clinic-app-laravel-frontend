<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/stores/auth'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await auth().login(username.value, password.value)
    router.push({ path: '/clinical/doctors' })
  } catch (err: any) {
    error.value = err.response?.data?.message ?? 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-clinic-50">
    <form class="w-full max-w-sm rounded-lg bg-white p-8 shadow" @submit.prevent="onSubmit">
      <h1 class="mb-6 text-xl font-semibold text-clinic-900">Clinic Admin Login</h1>

      <label class="mb-1 block text-sm font-medium text-gray-700">Username or email</label>
      <input
        v-model="username"
        type="text"
        required
        class="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none"
      />

      <label class="mb-1 block text-sm font-medium text-gray-700">Password</label>
      <input
        v-model="password"
        type="password"
        required
        class="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none"
      />

      <p v-if="error" class="mb-4 text-sm text-danger">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded bg-clinic-700 py-2 text-sm font-medium text-white hover:bg-clinic-800 disabled:opacity-50"
      >
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>
  </div>
</template>