export function resolveFileUrl(path?: string | null): string | null {
  if (!path) return null
  if (/^https?:\/\//.test(path)) return path
  const base = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
  return `${base}/file/${path}`
}