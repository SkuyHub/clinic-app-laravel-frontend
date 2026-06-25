import http from './http'

export interface UploadResponse {
  success: boolean
  path: string
  url: string
  filename: string
  field_value: string
}

function getUploadEndpoint(): string {
  if (window.location.pathname.startsWith('/doctor')) return '/doctor/upload-tmp'
  if (window.location.pathname.startsWith('/patient')) return '/patient/upload-tmp'
  return '/upload-tmp'
}

export async function uploadTmp(file: File): Promise<UploadResponse> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await http.post<UploadResponse>(getUploadEndpoint(), form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
