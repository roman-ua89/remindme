import { ApiClientError } from '@/lib/api-client'

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (error instanceof ApiClientError) {
    return error.message || fallback
  }

  if (error instanceof Error) {
    return error.message || fallback
  }

  return fallback
}

export function isUnauthorizedError(error: unknown) {
  return error instanceof ApiClientError && error.statusCode === 401
}

export function getAuthRedirectTarget(options: {
  isAuthenticated: boolean
  pathname: string
}): '/auth/login' | '/' | null {
  const isAuthRoute =
    options.pathname === '/auth' || options.pathname.startsWith('/auth/')

  if (options.isAuthenticated && isAuthRoute) return '/'
  if (!options.isAuthenticated && !isAuthRoute) return '/auth/login'
  return null
}
