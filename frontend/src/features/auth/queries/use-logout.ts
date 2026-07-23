import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { logout } from '@/features/auth/api'
import { queryKeys } from '@/lib/query-keys'

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.auth.currentUser })
      navigate({ to: '/auth/login' })
    },
  })
}
