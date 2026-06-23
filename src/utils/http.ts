import axios from 'axios'
import { storage } from './storage'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

// Request interceptor: attach the bearer token to every outgoing call.
// Equivalent in spirit to your CI4 AuthFilter running before() on every route.
http.interceptors.request.use((config) => {
  const token = storage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: react to a 401 the same way everywhere, instead of
// repeating "if 401, log out" in every component that calls the API.
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clearAll()
      // TODO: swap this for router.push({ name: 'login' }) once the router
      // exists — using a hard redirect for now so this file doesn't depend
      // on a router/index.ts we haven't built yet.
      if (window.location.pathname !== 'unauthenticated/login') {
        window.location.assign('unauthenticated/login')
      }
    }
    return Promise.reject(error)
  },
)

export default http