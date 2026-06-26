<script setup lang="ts">
import { computed } from 'vue'
import { patientAuth } from '@/stores/patient-auth'
import { resolveFileUrl } from '@/utils/files'
import Avatar from '@/components/base/Avatar.vue'
import http from '@/utils/http'
import { uploadTmp } from '@/utils/upload'
import { toast } from 'vue-sonner'

const auth = patientAuth()
const user = computed(() => auth.user)

async function uploadPhoto(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const uploaded = await uploadTmp(file)
    await http.put('/patient/profile', { photo: uploaded.path ?? uploaded })
    await auth.fetchProfile()
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
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
        <Avatar :photo-url="resolveFileUrl(user?.photo)" :name="user?.fullname ?? ''" size="lg" variant="teal" />
        <div class="text-center">
          <div class="text-lg font-semibold text-gray-900">{{ user?.fullname }}</div>
          <div class="text-sm text-gray-500">Patient #{{ user?.id }}</div>
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
          <span class="text-gray-500">Gender</span>
          <span class="font-medium text-gray-900 capitalize">{{ user?.gender || '—' }}</span>
        </div>
        <div class="flex justify-between py-3 text-sm">
          <span class="text-gray-500">Date of Birth</span>
          <span class="font-medium text-gray-900">{{ user?.birthdate || '—' }}</span>
        </div>
        <div class="flex justify-between py-3 text-sm">
          <span class="text-gray-500">Address</span>
          <span class="font-medium text-gray-900">{{ user?.address || '—' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
