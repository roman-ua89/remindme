import { useNavigate } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

type AddEntityButtonProps = {
    categoryId: string;
    topicId: string;
};

export function AddEntityButton({ categoryId, topicId }: AddEntityButtonProps) {
    const navigate = useNavigate();

    return (
        <Button
            onClick={() => {
                navigate({ to: `/categories/${categoryId}/topics/${topicId}/entities/new` });
            }}
        >
            <PlusIcon />
            Add entity
        </Button>
    );
}
