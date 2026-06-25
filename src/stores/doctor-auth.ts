import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/utils/http'
import type { DoctorUser, LoginResponse, MeResponse } from '@/types/api'

export const doctorAuth = defineStore('doctor-auth', () => {
  const doctorKey = 'doctor_user'
  const tokenKey = 'doctor_token'

  const stored = localStorage.getItem(doctorKey)
  const user = ref<DoctorUser | null>(stored ? JSON.parse(stored) : null)

  const isAuthenticated = computed(() => !!user.value && !!localStorage.getItem(tokenKey))

  async function login(email: string, password: string): Promise<DoctorUser> {
    const { data: body } = await http.post<LoginResponse>('/doctor/login', { email, password })
    localStorage.setItem(tokenKey, body.token)
    localStorage.setItem(doctorKey, JSON.stringify(body.data))
    user.value = body.data as unknown as DoctorUser
    await fetchProfile()
    return body.data as unknown as DoctorUser
  }

  async function fetchProfile(): Promise<DoctorUser> {
    const { data: body } = await http.get<MeResponse>('/doctor/me')
    localStorage.setItem(doctorKey, JSON.stringify(body.data))
    user.value = body.data as unknown as DoctorUser
    return body.data as unknown as DoctorUser
  }

  async function logout(): Promise<void> {
    try {
      await http.post('/logout')
    } finally {
      localStorage.removeItem(tokenKey)
      localStorage.removeItem(doctorKey)
      user.value = null
    }
  }

  return { user, isAuthenticated, login, fetchProfile, logout }
})
