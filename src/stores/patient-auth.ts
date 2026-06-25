import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/utils/http'
import { createStorage } from '@/utils/storage'
import type { PatientUser, MeResponse } from '@/types/api'

const storage = createStorage('patient')

export const patientAuth = defineStore('patient-auth', () => {
  const user = ref<PatientUser | null>(storage.getUser<PatientUser>())

  const isAuthenticated = computed(() => !!user.value && !!storage.getToken())

  function hydrate(token: string, data: PatientUser) {
    storage.setToken(token)
    storage.setUser(data)
    user.value = data
  }

  async function fetchProfile(): Promise<PatientUser> {
    const { data: body } = await http.get<MeResponse>('/patient/me')
    storage.setUser(body.data)
    user.value = body.data as unknown as PatientUser
    return body.data as unknown as PatientUser
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
