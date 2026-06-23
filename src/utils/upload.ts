import http from './http'

export interface UploadResponse {
  success: boolean
  path: string
  url: string
  filename: string
  field_value: string
}

export async function uploadTmp(file: File): Promise<UploadResponse> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await http.post<UploadResponse>('/upload-tmp', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}