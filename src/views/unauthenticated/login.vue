<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/stores/auth'
import { doctorAuth } from '@/stores/doctor-auth'
import { patientAuth } from '@/stores/patient-auth'
import { storage } from '@/utils/storage'
import type { AuthUser, DoctorUser, PatientUser } from '@/types/api'
import http from '@/utils/http'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    const { data: body } = await http.post('/login', { email: email.value, password: password.value })
    const { token, role, data } = body as { token: string; role: string; data: Record<string, unknown> }

    if (role === 'admin') {
      storage.setToken(token)
      storage.setUser(data)
      auth().user = data as AuthUser
      await auth().fetchProfile()
      router.push({ path: '/dashboard' })
    } else if (role === 'doctor') {
      doctorAuth().hydrate(token, data as DoctorUser)
      router.push({ path: '/doctor' })
    } else {
      patientAuth().hydrate(token, data as PatientUser)
      router.push({ path: '/patient' })
    }
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    error.value = err.response?.data?.message ?? 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-clinic-50">
    <form class="w-full max-w-sm rounded-lg bg-white p-8 shadow" @submit.prevent="onSubmit">
      <h1 class="mb-1 text-xl font-semibold text-clinic-900">Clinic App</h1>
      <p class="mb-6 text-sm text-gray-500">Sign in to your account</p>

      <label class="mb-1 block text-sm font-medium text-gray-700">Email</label>
      <input v-model="email" type="email" required class="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" />

      <label class="mb-1 block text-sm font-medium text-gray-700">Password</label>
      <input v-model="password" type="password" required class="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" />

      <p v-if="error" class="mb-4 text-sm text-danger">{{ error }}</p>

      <button type="submit" :disabled="loading" class="w-full rounded bg-clinic-700 py-2 text-sm font-medium text-white hover:bg-clinic-800 disabled:opacity-50">
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>

      <p class="mt-4 text-center text-sm text-gray-500">
        Don't have an account?
        <router-link to="/register" class="font-medium text-clinic-700 hover:text-clinic-800">Register</router-link>
      </p>
    </form>
  </div>
</template>
