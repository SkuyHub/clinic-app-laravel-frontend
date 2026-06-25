<script setup lang="ts">
import { computed } from 'vue'
import { doctorAuth } from '@/stores/doctor-auth'
import { resolveFileUrl } from '@/utils/files'
import Avatar from '@/components/base/Avatar.vue'
import http from '@/utils/http'
import { uploadTmp } from '@/utils/upload'
import { toast } from 'vue-sonner'

const auth = doctorAuth()
const user = computed(() => auth.user)

async function uploadPhoto(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const uploaded = await uploadTmp(file)
    await http.put('/doctor/profile', { photo: uploaded.path ?? uploaded })
    await auth.fetchProfile()
  } catch (err: any) {
    toast.error(err.response?.data?.message ?? 'Upload failed')
  }
}

async function toggleAvailable() {
  try {
    await http.put('/doctor/profile', { available: !user.value?.available })
    await auth.fetchProfile()
    toast.success(user.value?.available ? 'You are now available' : 'You are now unavailable')
  } catch (err: any) {
    toast.error(err.response?.data?.message ?? 'Failed to update status')
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
        <div class="text-center">
          <div class="text-lg font-semibold text-gray-900">{{ user?.fullname }}</div>
          <div class="text-sm text-gray-500">{{ user?.specialization }}</div>
        </div>
        <label class="cursor-pointer rounded bg-clinic-50 px-4 py-2 text-xs font-medium text-clinic-700 hover:bg-clinic-100">
          Change Photo
          <input type="file" accept="image/*" class="hidden" @change="uploadPhoto" />
        </label>
      </div>

      <div class="divide-y divide-gray-100 px-6">
        <div class="flex justify-between py-3 text-sm">
          <span class="text-gray-500">Email</span>
          <span class="font-medium text-gray-900">{{ user?.email }}</span>
        </div>
        <div class="flex justify-between py-3 text-sm">
          <span class="text-gray-500">Phone</span>
          <span class="font-medium text-gray-900">{{ user?.phone || '—' }}</span>
        </div>
        <div class="flex justify-between py-3 text-sm">
          <span class="text-gray-500">Specialization</span>
          <span class="font-medium text-gray-900">{{ user?.specialization }}</span>
        </div>
        <div class="flex items-center justify-between py-3 text-sm">
          <span class="text-gray-500">Availability</span>
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-900">{{ user?.available ? 'Available' : 'Unavailable' }}</span>
            <button
              class="rounded border border-gray-300 px-2 py-0.5 text-xs text-gray-600 hover:border-gray-400 hover:text-gray-900"
              @click="toggleAvailable"
            >
              Toggle
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
