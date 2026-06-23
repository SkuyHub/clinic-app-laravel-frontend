export interface ApiListResponse<T = any> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
  last_page: number
}

export interface ApiItemResponse<T = any> {
  success: boolean
  data: T
}

export interface ApiMessageResponse {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export interface ListParams {
  page?: number
  limit?: number
  search?: string
  [key: string]: any
}

export interface AuthUser {
  id: number
  fullname: string
  username: string
  email: string
  role_id: number
  photo?: string | null
}

export interface LoginResponse {
  success: boolean
  token: string
  data: AuthUser
}

export interface MeResponse {
  success: boolean
  data: AuthUser
  permissions: string[]
}