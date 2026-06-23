import http from './http'
import type { ApiListResponse, ApiItemResponse, ApiMessageResponse, ListParams } from '@/types/api'

const services = {
  list<T = any>(model: string, params?: ListParams) {
    return http.get<ApiListResponse<T>>(`/${model}/list`, { params }).then((res) => res.data)
  },

  dataset<T = any>(model: string, params?: ListParams) {
    return http.get<ApiListResponse<T>>(`/${model}/dataset`, { params }).then((res) => res.data)
  },

  show<T = any>(model: string, id: number | string) {
    return http.get<ApiItemResponse<T>>(`/${model}/${id}/show`).then((res) => res.data)
  },

  create<T = any>(model: string, payload: Record<string, any>) {
    return http.post<ApiItemResponse<T>>(`/${model}/create`, payload).then((res) => res.data)
  },

  update<T = any>(model: string, payload: Record<string, any>) {
    // id lives inside payload, not the URL — matches your backend's convention
    return http.put<ApiItemResponse<T>>(`/${model}/update`, payload).then((res) => res.data)
  },

  delete(model: string, id: number | string) {
    // axios quirk: DELETE request bodies go under `{ data: ... }` in the config
    // object, not as a second positional argument like post()/put() take.
    // Easy to miss — get this wrong and the backend never sees the id.
    return http.delete<ApiMessageResponse>(`/${model}/delete`, { data: { id } }).then((res) => res.data)
  },
}

export default services