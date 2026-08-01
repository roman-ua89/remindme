export function resolveMediaUrl(url: string): string {
  if (url.startsWith('http') || url.startsWith('blob:')) {
    return url
  }

  const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'
  return `${new URL(base).origin}${url}`
}
