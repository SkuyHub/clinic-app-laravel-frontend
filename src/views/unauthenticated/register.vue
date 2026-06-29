<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { patientAuth } from '@/stores/patient-auth'
import { uploadTmp } from '@/utils/upload'
import type { PatientUser } from '@/types/api'
import http from '@/utils/http'

const router = useRouter()

const form = ref({ fullname: '', email: '', password: '', phone: '', birthdate: '', gender: '', address: '', photo: '' })
const error = ref('')
const loading = ref(false)
const uploading = ref(false)

async function handlePhoto(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const res = await uploadTmp(file)
    form.value.photo = res.field_value
  } catch {
    error.value = 'Photo upload failed.'
  } finally {
    uploading.value = false
  }
}

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    const { data: body } = await http.post('/patient/register', { ...form.value })
    const { token, data } = body as { token: string; data: PatientUser }
    patientAuth().hydrate(token, data)
    router.push({ path: '/patient' })
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    error.value = err.response?.data?.message ?? 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-clinic-50 py-10">
    <form class="w-full max-w-md rounded-lg bg-white p-8 shadow" @submit.prevent="onSubmit">
      <h1 class="mb-1 text-xl font-semibold text-clinic-900">Create Account</h1>
      <p class="mb-6 text-sm text-gray-500">Register as a new patient</p>

      <label class="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
      <input v-model="form.fullname" type="text" required class="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" />

      <label class="mb-1 block text-sm font-medium text-gray-700">Email</label>
      <input v-model="form.email" type="email" required class="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" />

      <label class="mb-1 block text-sm font-medium text-gray-700">Password</label>
      <input v-model="form.password" type="password" required minlength="6" class="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" />

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Phone</label>
          <input v-model="form.phone" type="text" placeholder="+62..." class="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Date of Birth</label>
          <input v-model="form.birthdate" type="date" class="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Gender</label>
          <select v-model="form.gender" class="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none">
            <option value="">—</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Photo</label>
          <input type="file" accept="image/*" :disabled="uploading" class="mb-4 w-full text-sm text-gray-500 file:mr-3 file:rounded file:border-0 file:bg-clinic-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-clinic-700" @change="handlePhoto" />
          <span v-if="uploading" class="text-xs text-gray-400">Uploading…</span>
        </div>
      </div>

      <label class="mb-1 block text-sm font-medium text-gray-700">Address</label>
      <textarea v-model="form.address" rows="2" class="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" placeholder="Full address (optional)" />

      <p v-if="error" class="mb-4 text-sm text-danger">{{ error }}</p>

      <button type="submit" :disabled="loading" class="w-full rounded bg-clinic-700 py-2 text-sm font-medium text-white hover:bg-clinic-800 disabled:opacity-50">
        {{ loading ? 'Creating account…' : 'Register' }}
      </button>

      <p class="mt-4 text-center text-sm text-gray-500">
        Already have an account?
        <router-link to="/login" class="font-medium text-clinic-700 hover:text-clinic-800">Sign in</router-link>
      </p>
    </form>
  </div>
</template>
