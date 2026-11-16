import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { login } from '@/features/auth/api';
import { getApiErrorMessage } from '@/lib/auth';
import { queryKeys } from '@/lib/query-keys';

export function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: login,
        onSuccess: (user) => {
            queryClient.setQueryData(queryKeys.auth.currentUser, user);
            navigate({ to: '/' });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });
}
