import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/utils/http'
import { createStorage } from '@/utils/storage'
import type { MeResponse } from '@/types/api'

export function createPortalAuthStore<T extends Record<string, unknown>>(
  ns: string,
  mePath: string,
) {
  const storage = createStorage(ns)

  return defineStore(`${ns}-auth`, () => {
    const user = ref<T | null>(storage.getUser<T>())
    const isAuthenticated = computed(() => !!user.value && !!storage.getToken())

    function hydrate(token: string, data: T) {
      storage.setToken(token)
      storage.setUser(data)
      user.value = data
    }

    async function fetchProfile(): Promise<T> {
      const { data: body } = await http.get<MeResponse>(mePath)
      storage.setUser(body.data)
      user.value = body.data as unknown as T
      return body.data as unknown as T
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
}
