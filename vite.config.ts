import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const pagesBase = '/edge-repro-export/';

function reproStep(): Plugin {
    return {
        name: 'repro-step',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const url = req.url?.split('?')[0];
                const isAppRoot =
                    url === '/' ||
                    url === pagesBase ||
                    url === pagesBase.slice(0, -1);

                if (req.method !== 'PATCH' || !isAppRoot) {
                    next();

                    return;
                }

                res.statusCode = 303;
                res.setHeader(
                    'Set-Cookie',
                    'repro_step=2; Path=/; SameSite=Lax',
                );
                res.setHeader('Location', pagesBase);
                res.end();
            });
        },
    };
}

export default defineConfig({
    base: pagesBase,
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
