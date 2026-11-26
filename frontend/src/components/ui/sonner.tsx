import { Toaster as Sonner } from 'sonner';
import type { ToasterProps } from 'sonner';
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from 'lucide-react';

// Sonner's default padding, gap, font and shadow rules are dropped by `unstyled`, so these classes own the toast layout.
// Typed toasts get their background, border colour and text colour from the richColors variables below.
const toastClassName = [
    'font-sans flex w-[var(--width)] items-center gap-3 rounded-[14px] px-4 py-3',
    'not-data-[type]:bg-toast-default not-data-[type]:text-toast-default-foreground not-data-[type]:shadow-toast',
    'not-data-[type]:[&_[data-button]]:text-toast-default-action',
    'data-[type]:border data-[type]:py-3.5',
].join(' ');

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme='light'
            position='top-center'
            richColors
            className='toaster group'
            icons={{
                success: <CircleCheckIcon className='size-5' />,
                info: <InfoIcon className='size-5 text-toast-info-muted' />,
                warning: <TriangleAlertIcon className='size-5' />,
                error: <OctagonXIcon className='size-5' />,
                loading: <Loader2Icon className='size-4 animate-spin' />,
            }}
            style={
                {
                    '--success-bg': 'var(--toast-success-soft)',
                    '--success-border': 'var(--toast-success-border)',
                    '--success-text': 'var(--toast-success)',
                    '--error-bg': 'var(--toast-error-soft)',
                    '--error-border': 'var(--toast-error-border)',
                    '--error-text': 'var(--toast-error)',
                    '--warning-bg': 'var(--toast-warning-soft)',
                    '--warning-border': 'var(--toast-warning-border)',
                    '--warning-text': 'var(--toast-warning)',
                    '--info-bg': 'var(--toast-info-soft)',
                    '--info-border': 'var(--toast-info-border)',
                    '--info-text': 'var(--toast-info)',
                } as React.CSSProperties
            }
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: toastClassName,
                    content: 'flex flex-col gap-0.5',
                    icon: 'flex shrink-0',
                    title: 'text-[15px] font-semibold',
                    description: 'text-[14px] leading-[1.5]',
                    actionButton: 'font-semibold',
                    info: '[&_[data-description]]:text-toast-info-muted',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
