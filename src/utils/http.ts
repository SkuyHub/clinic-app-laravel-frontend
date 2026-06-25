import axios from 'axios'
import { storage } from './storage'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

function detectGuard(): string | null {
  if (window.location.pathname.startsWith('/doctor')) return 'doctor'
  if (window.location.pathname.startsWith('/patient')) return 'patient'
  return null
}

http.interceptors.request.use((config) => {
  const guard = detectGuard()
  let token: string | null = null

  if (guard === 'doctor') {
    token = localStorage.getItem('doctor_token')
  } else if (guard === 'patient') {
    token = localStorage.getItem('patient_token')
  } else {
    token = storage.getToken()
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const guard = detectGuard()

      if (guard === 'doctor') {
        localStorage.removeItem('doctor_token')
        localStorage.removeItem('doctor_user')
      } else if (guard === 'patient') {
        localStorage.removeItem('patient_token')
        localStorage.removeItem('patient_user')
      } else {
        storage.clearAll()
      }

      import('@/router').then(({ default: router }) => {
        if (router.currentRoute.value.name !== 'login') {
          router.push({ name: 'login' })
        }
      })
    }
    return Promise.reject(error)
  },
)

export default http
