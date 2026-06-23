import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/utils/http'
import { storage } from '@/utils/storage'
import { permissions } from './permissions'
import type { AuthUser, LoginResponse, MeResponse } from '@/types/api'

export const auth = defineStore('auth', () => {
  const user = ref<AuthUser | null>(storage.getUser<AuthUser>())

  const isAuthenticated = computed(() => !!user.value && !!storage.getToken())

  async function login(username: string, password: string): Promise<AuthUser> {
    const { data: body } = await http.post<LoginResponse>('/login', { username, password })
    storage.setToken(body.token)
    storage.setUser(body.data)
    user.value = body.data
    await fetchProfile()
    return body.data
  }

  async function fetchProfile(): Promise<AuthUser> {
    const { data: body } = await http.get<MeResponse>('/me')
    storage.setUser(body.data)
    storage.setPermissions(body.permissions)
    user.value = body.data
    permissions().build(body.permissions)
    return body.data
  }

  async function logout(): Promise<void> {
    try {
      await http.post('/logout')
    } finally {
      storage.clearAll()
      user.value = null
      permissions().clear()
    }
  }

  return { user, isAuthenticated, login, fetchProfile, logout }
})