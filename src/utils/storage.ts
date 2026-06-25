const TOKEN_KEY = 'token'
const USER_KEY = 'user'
const PERMISSIONS_KEY = 'permissions'

function read<T>(key: string): T | null {
  const raw = localStorage.getItem(key)
  if (raw === null) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return raw as unknown as T
  }
}

function write(key: string, value: unknown): void {
  localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
}

function remove(key: string): void {
  localStorage.removeItem(key)
}

export const storage = {
  getToken: () => read<string>(TOKEN_KEY),
  setToken: (token: string) => write(TOKEN_KEY, token),
  clearToken: () => remove(TOKEN_KEY),

  getUser: <T = Record<string, any>>() => read<T>(USER_KEY),
  setUser: (user: unknown) => write(USER_KEY, user),
  clearUser: () => remove(USER_KEY),

  getPermissions: () => read<string[]>(PERMISSIONS_KEY) ?? [],
  setPermissions: (permissions: string[]) => write(PERMISSIONS_KEY, permissions),
  clearPermissions: () => remove(PERMISSIONS_KEY),

  clearAll(): void {
    this.clearToken()
    this.clearUser()
    this.clearPermissions()
  },
}

export function createStorage(ns: string) {
  const tokenKey = `${ns}_token`
  const userKey = `${ns}_user`

  return {
    getToken: () => read<string>(tokenKey),
    setToken: (token: string) => write(tokenKey, token),
    getUser: <T = Record<string, any>>() => read<T>(userKey),
    setUser: (user: unknown) => write(userKey, user),
    clearAll(): void {
      remove(tokenKey)
      remove(userKey)
    },
  }
}
