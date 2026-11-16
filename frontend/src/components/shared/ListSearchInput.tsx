import { SearchIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';

type ListSearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    isPending?: boolean;
    showClean?: boolean;
    onClean?: () => void;
    placeholder?: string;
};

export function ListSearchInput({ value, onChange, isPending = false, showClean = false, onClean, placeholder = 'Search' }: ListSearchInputProps) {
    return (
        <div className='rounded-lg bg-gray-200/60 p-2'>
            <InputGroup className='w-60'>
                <InputGroupInput placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
                {isPending ? (
                    <InputGroupAddon align='inline-start'>
                        <Spinner />
                    </InputGroupAddon>
                ) : (
                    <InputGroupAddon align='inline-start'>
                        <SearchIcon />
                    </InputGroupAddon>
                )}
                {showClean && (
                    <Button type='button' variant='ghost' size='icon' aria-label='Clean' onClick={onClean}>
                        <X />
                    </Button>
                )}
            </InputGroup>
        </div>
    );
}
