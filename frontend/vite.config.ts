import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';

import { tanstackRouter } from '@tanstack/router-plugin/vite';

import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const config = defineConfig({
    envDir: '.',
    resolve: { tsconfigPaths: true },
    plugins: [devtools(), tailwindcss(), tanstackRouter({ target: 'react', autoCodeSplitting: true }), viteReact()],
    server: {
        // Same-origin in dev: the browser calls /api/v1 on the Vite origin and Vite forwards it to the Express API.
        proxy: {
            '/api': { target: 'http://localhost:3000', changeOrigin: true },
        },
    },
});

export default config;
