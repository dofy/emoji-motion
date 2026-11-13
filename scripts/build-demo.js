import { mkdir, copyFile, rm } from 'node:fs/promises';
const dist = new URL('../dist/', import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(new URL('demo/', dist), { recursive: true });
await mkdir(new URL('src/', dist), { recursive: true });
await mkdir(new URL('demo/vendor/', dist), { recursive: true });
for (const [source, target] of [['demo/index.html', 'index.html'], ['UNICODE-LICENSE.txt', 'UNICODE-LICENSE.txt'], ['demo/main.js', 'demo/main.js'], ['demo/style.css', 'demo/style.css'], ['src/index.js', 'src/index.js'], ['src/registry.js', 'src/registry.js'], ['src/unicode.js', 'src/unicode.js'], ['src/unicode-data.js', 'src/unicode-data.js'], ['src/element.js', 'src/element.js'], ['src/element-core.js', 'src/element-core.js'], ['src/presets.js', 'src/presets.js']]) {
  await copyFile(new URL(`../${source}`, import.meta.url), new URL(target, dist));
}
console.log('Built static demo in dist/');

await copyFile(new URL('../node_modules/prismjs/prism.js', import.meta.url), new URL('demo/vendor/prism.js', dist));
await copyFile(new URL('../node_modules/prismjs/components/prism-jsx.min.js', import.meta.url), new URL('demo/vendor/prism-jsx.js', dist));
await copyFile(new URL('../node_modules/prismjs/LICENSE', import.meta.url), new URL('demo/vendor/PRISM-LICENSE', dist));
