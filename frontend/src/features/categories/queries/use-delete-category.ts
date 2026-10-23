import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteCategory } from '@/features/categories/api';
import { getApiErrorMessage } from '@/lib/auth';
import { queryKeys } from '@/lib/query-keys';

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: (_data, categoryId) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.stats.library });
            queryClient.removeQueries({ queryKey: queryKeys.categories.detail(categoryId) });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });
}
