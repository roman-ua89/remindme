import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
                positive:
                    'bg-positive text-positive-foreground shadow-positive-glow hover:bg-positive-hover disabled:bg-positive-disabled disabled:text-positive-disabled-foreground disabled:opacity-100 disabled:shadow-none',
                secondary:
                    'border-info-border bg-info text-info-foreground hover:border-info-border-hover hover:bg-info-hover aria-expanded:border-info-border-hover aria-expanded:bg-info-hover',
                stop: 'border-stop-border bg-stop text-stop-foreground hover:border-stop-border-hover hover:bg-stop-hover',
                outline:
                    'border-border bg-card hover:border-input hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground',
                ghost: 'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
                destructive:
                    'bg-destructive-soft text-destructive hover:bg-destructive-soft-hover focus-visible:border-destructive/40 focus-visible:ring-destructive/20',
                defaultEditorBtn:
                    'text-sm bg-blue-300 text-white font-semibold py-0 px-2 rounded-sm transition-all duration-200 ease-in-out hover:bg-blue-400 cursor-pointer',
                selectedEditorBtn:
                    'text-sm bg-blue-500 text-white font-semibold py-0 px-2 rounded-sm transition-all duration-200 ease-in-out hover:bg-blue-400 cursor-pointer',
            },
            size: {
                default: 'h-11 gap-1.5 px-5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
                sm: 'h-8 gap-1 px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5',
                lg: 'h-13 gap-1.5 px-6 text-base has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
                xl: 'h-[62px] gap-1.5 px-8 text-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
                icon: 'size-10',
                'icon-sm': 'size-8',
            },
        },
        compoundVariants: [
            {
                variant: ['defaultEditorBtn', 'selectedEditorBtn'],
                size: 'sm',
                className: 'rounded-[10px]',
            },
        ],
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

function Button({ className, variant = 'default', size = 'default', ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
    return <ButtonPrimitive data-slot='button' className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
