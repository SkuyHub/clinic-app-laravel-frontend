import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/utils/http'
import { createStorage } from '@/utils/storage'
import type { DoctorUser, MeResponse } from '@/types/api'

const storage = createStorage('doctor')

export const doctorAuth = defineStore('doctor-auth', () => {
  const user = ref<DoctorUser | null>(storage.getUser<DoctorUser>())

  const isAuthenticated = computed(() => !!user.value && !!storage.getToken())

  function hydrate(token: string, data: DoctorUser) {
    storage.setToken(token)
    storage.setUser(data)
    user.value = data
  }

  async function fetchProfile(): Promise<DoctorUser> {
    const { data: body } = await http.get<MeResponse>('/doctor/me')
    storage.setUser(body.data)
    user.value = body.data as unknown as DoctorUser
    return body.data as unknown as DoctorUser
  }

  async function logout(): Promise<void> {
    try {
      await http.post('/logout')
    } finally {
      storage.clearAll()
      user.value = null
    }
  }

  return { user, isAuthenticated, hydrate, fetchProfile, logout }
})
