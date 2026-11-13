import { mkdir, copyFile, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const dist = new URL('../dist/', import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(new URL('demo/', dist), { recursive: true });
await mkdir(new URL('src/', dist), { recursive: true });
await mkdir(new URL('assets/', dist), { recursive: true });
await mkdir(new URL('docs/', dist), { recursive: true });
await mkdir(new URL('shared/', dist), { recursive: true });
await mkdir(new URL('i18n/', dist), { recursive: true });
await mkdir(new URL('demo/vendor/', dist), { recursive: true });
for (const [source, target] of [['shared/settings.js', 'shared/settings.js'], ['shared/theme.css', 'shared/theme.css'], ['i18n/zh-CN.json', 'i18n/zh-CN.json'], ['i18n/zh-TW.json', 'i18n/zh-TW.json'], ['i18n/ja.json', 'i18n/ja.json'], ['demo/index.html', 'index.html'], ['assets/logo.svg', 'assets/logo.svg'], ['docs/index.html', 'docs/index.html'], ['docs/style.css', 'docs/style.css'], ['docs/main.js', 'docs/main.js'], ['UNICODE-LICENSE.txt', 'UNICODE-LICENSE.txt'], ['demo/main.js', 'demo/main.js'], ['demo/style.css', 'demo/style.css'], ['src/index.js', 'src/index.js'], ['src/registry.js', 'src/registry.js'], ['src/enhance.js', 'src/enhance.js'], ['src/unicode.js', 'src/unicode.js'], ['src/unicode-data.js', 'src/unicode-data.js'], ['src/element.js', 'src/element.js'], ['src/element-core.js', 'src/element-core.js'], ['src/presets.js', 'src/presets.js']]) {
  await copyFile(new URL(`../${source}`, import.meta.url), new URL(target, dist));
}
// Version locale requests too, so language updates are not hidden by a cached JSON file.
const localeSources = await Promise.all(['zh-CN', 'zh-TW', 'ja'].map(name => readFile(new URL(`i18n/${name}.json`, dist))));
const localeVersion = createHash('sha256').update(Buffer.concat(localeSources)).digest('hex').slice(0, 12);
const settingsPath = new URL('shared/settings.js', dist);
const settings = await readFile(settingsPath, 'utf8');
await writeFile(settingsPath, settings.replace('/i18n/${language}.json', `/i18n/\${language}.json?v=${localeVersion}`));
// Version relative imports as well as entry points: preset changes must reach
// browsers even when a CDN has cached the previous module graph.
const modules = ['demo/main.js', 'docs/main.js', 'src/index.js', 'src/registry.js', 'src/enhance.js', 'src/unicode.js', 'src/unicode-data.js', 'src/element.js', 'src/element-core.js', 'src/presets.js'];
const sources = await Promise.all(modules.map(path => readFile(new URL(path, dist), 'utf8')));
const moduleVersion = createHash('sha256').update(sources.join('\0')).digest('hex').slice(0, 12);
for (const [index, path] of modules.entries()) {
  const versioned = sources[index].replace(/((?:\bfrom\s*|\bimport\s*)['"])(\.\.?\/[^'"]+\.js)(['"])/g, `$1$2?v=${moduleVersion}$3`);
  await writeFile(new URL(path, dist), versioned);
}
// Content-address the demo assets so an edge cache cannot serve an older UI.
let html = await readFile(new URL('index.html', dist), 'utf8');
for (const path of ['demo/style.css', 'demo/main.js', 'shared/settings.js', 'shared/theme.css']) {
  const digest = createHash('sha256').update(await readFile(new URL(path, dist))).digest('hex').slice(0, 12);
  html = html.replace(`/${path}"`, `/${path}?v=${digest}"`);
}
const logoDigest = createHash('sha256').update(await readFile(new URL('assets/logo.svg', dist))).digest('hex').slice(0, 12);
html = html.replaceAll('/assets/logo.svg"', `/assets/logo.svg?v=${logoDigest}"`);
await writeFile(new URL('index.html', dist), html);
let docsHtml = await readFile(new URL('docs/index.html', dist), 'utf8');
for (const path of ['docs/style.css', 'docs/main.js', 'shared/settings.js', 'shared/theme.css']) {
  const digest = createHash('sha256').update(await readFile(new URL(path, dist))).digest('hex').slice(0, 12);
  docsHtml = docsHtml.replaceAll(`/${path}"`, `/${path}?v=${digest}"`);
}
docsHtml = docsHtml.replaceAll('/assets/logo.svg"', `/assets/logo.svg?v=${logoDigest}"`);
await writeFile(new URL('docs/index.html', dist), docsHtml);
console.log('Built static demo in dist/');

await copyFile(new URL('../node_modules/prismjs/prism.js', import.meta.url), new URL('demo/vendor/prism.js', dist));
await copyFile(new URL('../node_modules/prismjs/components/prism-jsx.min.js', import.meta.url), new URL('demo/vendor/prism-jsx.js', dist));
await copyFile(new URL('../node_modules/prismjs/LICENSE', import.meta.url), new URL('demo/vendor/PRISM-LICENSE', dist));
