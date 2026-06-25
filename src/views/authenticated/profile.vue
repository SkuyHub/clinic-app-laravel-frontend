<script setup lang="ts">
import { ref } from 'vue'
import { auth } from '@/stores/auth'
import { resolveFileUrl } from '@/utils/files'
import Avatar from '@/components/base/Avatar.vue'
import http from '@/utils/http'
import { uploadTmp } from '@/utils/upload'
import { toast } from 'vue-sonner'

const authStore = auth()
const user = authStore.user

const fullname = ref(user?.fullname ?? '')
const username = ref(user?.username ?? '')
const email = ref(user?.email ?? '')
const password = ref('')
const saving = ref(false)

async function saveProfile() {
  saving.value = true
  try {
    const payload: Record<string, any> = { fullname: fullname.value, username: username.value, email: email.value }
    if (password.value) payload.password = password.value
    const { data } = await http.put('/profile', payload)
    authStore.user = data.data
    password.value = ''
    toast.success('Profile updated.')
  } catch (err: any) {
    toast.error(err.response?.data?.message ?? 'Update failed')
  } finally {
    saving.value = false
  }
}

async function uploadPhoto(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const uploaded = await uploadTmp(file)
    await http.put('/profile', { photo: uploaded.path ?? uploaded })
    await authStore.fetchProfile()
    toast.success('Photo updated.')
  } catch (err: any) {
    toast.error(err.response?.data?.message ?? 'Upload failed')
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="text-xl font-semibold text-clinic-900">My Profile</h1>
      <p class="text-sm text-gray-500">Your account information</p>
    </div>

    <div class="max-w-md rounded-lg border border-gray-200 bg-white shadow-sm">
      <div class="flex flex-col items-center gap-3 px-6 pt-6 pb-4">
        <Avatar :photo-url="resolveFileUrl(user?.photo)" :name="user?.fullname ?? ''" size="lg" variant="green" />
        <label class="cursor-pointer rounded bg-clinic-50 px-4 py-2 text-xs font-medium text-clinic-700 hover:bg-clinic-100">
          Change Photo
          <input type="file" accept="image/*" class="hidden" @change="uploadPhoto" />
        </label>
      </div>

      <div class="flex flex-col gap-4 px-6 pb-6">
        <div>
          <label class="text-sm font-medium text-gray-700">Full name</label>
          <input v-model="fullname" class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Username</label>
          <input v-model="username" class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">New password <span class="font-normal text-gray-400">(leave blank to keep)</span></label>
          <input v-model="password" type="password" class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" />
        </div>
        <button :disabled="saving" class="rounded bg-clinic-700 px-4 py-2 text-sm font-medium text-white hover:bg-clinic-800 disabled:opacity-50" @click="saveProfile">
          {{ saving ? 'Saving…' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>
