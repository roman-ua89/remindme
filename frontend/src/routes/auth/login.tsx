import { createFileRoute, redirect } from '@tanstack/react-router';

// Login now lives in a dialog on the home page; keep this URL working for old links and bookmarks.
export const Route = createFileRoute('/auth/login')({
    beforeLoad: () => {
        throw redirect({ to: '/', search: { login: true } });
    },
});
