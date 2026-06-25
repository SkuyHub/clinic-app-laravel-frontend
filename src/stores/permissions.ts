import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storage } from '@/utils/storage'

export const permissions = defineStore('permissions', () => {
  const value = ref<Set<string>>(new Set(storage.getPermissions()))

  function build(data: string[]): void {
    value.value = new Set(data)
  }

  function has(permission?: string | null): boolean {
    if (!permission) return true
    return value.value.has(permission)
  }

  function clear(): void {
    value.value = new Set()
  }

  return { value, has, build, clear }
})
