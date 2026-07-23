import type { AuthMessage, LoginInput, User } from '@remindme/contracts/auth'

import { apiClient } from '@/lib/api-client'

export async function login(input: LoginInput): Promise<User> {
  const { data } = await apiClient.post<User>('/auth/login', input)
  return data
}

export async function logout(): Promise<AuthMessage> {
  const { data } = await apiClient.post<AuthMessage>('/auth/logout')
  return data
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me')
  return data
}
