import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { uploadMedia } from '@/features/media/api'
import { getApiErrorMessage } from '@/lib/auth'

export function useUploadMedia() {
  return useMutation({
    mutationFn: uploadMedia,
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to upload image'))
    },
  })
}
