import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

function reproStep(): Plugin {
    return {
        name: 'repro-step',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const url = req.url?.split('?')[0];

                if (req.method !== 'PATCH' || url !== '/') {
                    next();

                    return;
                }

                res.statusCode = 303;
                res.setHeader(
                    'Set-Cookie',
                    'repro_step=2; Path=/; SameSite=Lax',
                );
                res.setHeader('Location', '/');
                res.end();
            });
        },
    };
}

export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        reproStep(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(
                path.dirname(fileURLToPath(import.meta.url)),
                'src',
            ),
        },
    },
});
