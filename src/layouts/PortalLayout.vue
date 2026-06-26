<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doctorAuth } from '@/stores/doctor-auth'
import { patientAuth } from '@/stores/patient-auth'
import { resolveFileUrl } from '@/utils/files'
import Avatar from '@/components/base/Avatar.vue'

const props = defineProps<{ role: 'doctor' | 'patient' }>()

const route = useRoute()
const router = useRouter()

const auth = computed(() => (props.role === 'doctor' ? doctorAuth() : patientAuth()))
const user = computed(() => auth.value.user)

onMounted(() => {
  auth.value.fetchProfile().catch(() => {})
})
const name = computed(() => user.value?.fullname ?? '')
const email = computed(() => user.value?.email ?? '')
const detail = computed(() => {
  if (props.role === 'doctor' && user.value) {
    return (user.value as { specialization?: string }).specialization ?? ''
  }
  return ''
})

const links = computed(() => {
  const prefix = `/${props.role}`
  return [
    { label: 'Dashboard', to: `${prefix}/dashboard`, active: route.path === `${prefix}/dashboard` || route.path === prefix },
    { label: 'Appointments', to: `${prefix}/appointments`, active: route.path === `${prefix}/appointments` },
    { label: 'Medical Records', to: `${prefix}/medical-records`, active: route.path === `${prefix}/medical-records` },
    { label: 'Profile', to: `${prefix}/profile`, active: route.path === `${prefix}/profile` },
  ]
})

async function handleLogout() {
  await auth.value.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
      <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div class="flex items-center gap-8">
          <div class="flex items-center gap-2 text-lg font-semibold text-clinic-900">
            <span class="text-xl">🏥</span>
            <span>Clinic<em class="italic not-italic text-clinic-600">App</em></span>
            <span class="ml-1 rounded bg-clinic-100 px-2 py-0.5 text-xs font-medium text-clinic-700 capitalize">{{ role }}</span>
          </div>
          <div class="flex items-center gap-1">
            <router-link
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="rounded px-3 py-1.5 text-sm font-medium transition-colors"
              :class="link.active ? 'bg-clinic-50 text-clinic-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
            >
              {{ link.label }}
            </router-link>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 text-sm">
            <Avatar :photo-url="resolveFileUrl(user?.photo)" :name="name" size="sm" variant="green" />
            <div class="hidden sm:block">
              <div class="font-medium text-gray-900 text-sm leading-tight">{{ name }}</div>
              <div class="text-xs text-gray-500 leading-tight">{{ detail || email }}</div>
            </div>
          </div>
          <button class="rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:border-gray-400 hover:text-gray-900" @click="handleLogout">Logout</button>
        </div>
      </div>
    </nav>

    <main class="mx-auto max-w-6xl px-6 py-6">
      <RouterView />
    </main>
  </div>
</template>
