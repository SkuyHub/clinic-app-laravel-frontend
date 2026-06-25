import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/utils/http'
import type { PatientUser, LoginResponse, MeResponse } from '@/types/api'

export const patientAuth = defineStore('patient-auth', () => {
  const patientKey = 'patient_user'
  const tokenKey = 'patient_token'

  const stored = localStorage.getItem(patientKey)
  const user = ref<PatientUser | null>(stored ? JSON.parse(stored) : null)

  const isAuthenticated = computed(() => !!user.value && !!localStorage.getItem(tokenKey))

  async function login(email: string, password: string): Promise<PatientUser> {
    const { data: body } = await http.post<LoginResponse>('/patient/login', { email, password })
    localStorage.setItem(tokenKey, body.token)
    localStorage.setItem(patientKey, JSON.stringify(body.data))
    user.value = body.data as unknown as PatientUser
    await fetchProfile()
    return body.data as unknown as PatientUser
  }

  async function fetchProfile(): Promise<PatientUser> {
    const { data: body } = await http.get<MeResponse>('/patient/me')
    localStorage.setItem(patientKey, JSON.stringify(body.data))
    user.value = body.data as unknown as PatientUser
    return body.data as unknown as PatientUser
  }

  async function logout(): Promise<void> {
    try {
      await http.post('/logout')
    } finally {
      localStorage.removeItem(tokenKey)
      localStorage.removeItem(patientKey)
      user.value = null
    }
  }

  return { user, isAuthenticated, login, fetchProfile, logout }
})
