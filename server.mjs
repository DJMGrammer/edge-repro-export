import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'dist');
const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.png': 'image/png',
};

function insideRoot(file) {
    const resolved = normalize(file);

    return resolved === root || resolved.startsWith(root + sep);
}

createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');

    if (req.method === 'PATCH') {
        res.writeHead(303, {
            'Set-Cookie': 'repro_step=2; Path=/; SameSite=Lax',
            Location: '/',
        });
        res.end();

        return;
    }

    const pathname = decodeURIComponent(url.pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const file = join(root, relative);

    if (!insideRoot(file)) {
        res.writeHead(403);
        res.end();

        return;
    }

    try {
        const body = await readFile(file);
        res.writeHead(200, {
            'Content-Type':
                types[extname(file)] ?? 'application/octet-stream',
            'X-Robots-Tag': 'noindex, nofollow',
        });
        res.end(body);
    } catch {
        const html = await readFile(join(root, 'index.html'));
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Robots-Tag': 'noindex, nofollow',
        });
        res.end(html);
    }
}).listen(4173, '127.0.0.1');
