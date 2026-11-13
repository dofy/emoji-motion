import { mkdir, copyFile, rm } from 'node:fs/promises';
const dist = new URL('../dist/', import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(new URL('demo/', dist), { recursive: true });
await mkdir(new URL('src/', dist), { recursive: true });
for (const [source, target] of [['demo/index.html', 'index.html'], ['demo/main.js', 'demo/main.js'], ['demo/style.css', 'demo/style.css'], ['src/index.js', 'src/index.js'], ['src/presets.js', 'src/presets.js']]) {
  await copyFile(new URL(`../${source}`, import.meta.url), new URL(target, dist));
}
console.log('Built static demo in dist/');
