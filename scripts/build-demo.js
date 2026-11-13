import { mkdir, copyFile, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const dist = new URL('../dist/', import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(new URL('demo/', dist), { recursive: true });
await mkdir(new URL('src/', dist), { recursive: true });
await mkdir(new URL('demo/vendor/', dist), { recursive: true });
for (const [source, target] of [['demo/index.html', 'index.html'], ['UNICODE-LICENSE.txt', 'UNICODE-LICENSE.txt'], ['demo/main.js', 'demo/main.js'], ['demo/style.css', 'demo/style.css'], ['src/index.js', 'src/index.js'], ['src/registry.js', 'src/registry.js'], ['src/unicode.js', 'src/unicode.js'], ['src/unicode-data.js', 'src/unicode-data.js'], ['src/element.js', 'src/element.js'], ['src/element-core.js', 'src/element-core.js'], ['src/presets.js', 'src/presets.js']]) {
  await copyFile(new URL(`../${source}`, import.meta.url), new URL(target, dist));
}
// Content-address the demo assets so an edge cache cannot serve an older UI.
let html = await readFile(new URL('index.html', dist), 'utf8');
for (const path of ['demo/style.css', 'demo/main.js']) {
  const digest = createHash('sha256').update(await readFile(new URL(path, dist))).digest('hex').slice(0, 12);
  html = html.replace(`/${path}"`, `/${path}?v=${digest}"`);
}
await writeFile(new URL('index.html', dist), html);
console.log('Built static demo in dist/');

await copyFile(new URL('../node_modules/prismjs/prism.js', import.meta.url), new URL('demo/vendor/prism.js', dist));
await copyFile(new URL('../node_modules/prismjs/components/prism-jsx.min.js', import.meta.url), new URL('demo/vendor/prism-jsx.js', dist));
await copyFile(new URL('../node_modules/prismjs/LICENSE', import.meta.url), new URL('demo/vendor/PRISM-LICENSE', dist));
