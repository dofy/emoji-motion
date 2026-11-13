import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    const vendor = { '/demo/vendor/prism.js': '/node_modules/prismjs/prism.js', '/demo/vendor/prism-jsx.js': '/node_modules/prismjs/components/prism-jsx.min.js' };
    const path = resolve(root, '.' + (vendor[pathname] ?? (pathname === '/' ? '/demo/index.html' : pathname === '/docs' || pathname === '/docs/' ? '/docs/index.html' : pathname)));
    if (!path.startsWith(root + sep)) throw new Error('Invalid path');
    const data = await readFile(path); res.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' }); res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log(`Demo: http://127.0.0.1:${server.address().port}`));
