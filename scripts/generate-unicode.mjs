import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const version = '18.0.0';
const url = `https://www.unicode.org/Public/${version}/emoji/emoji-test.txt`;
const expectedHash = '8f3735cda1f92a779d78af67cf86066bb1f07143dc22f2ac29394d9bc57ab21a';
const input = process.argv[2] ? await readFile(process.argv[2]) : Buffer.from(await (await fetch(url)).arrayBuffer());
if (createHash('sha256').update(input).digest('hex') !== expectedHash) throw new Error('Unicode data checksum mismatch');
const names = []; const nameIds = new Map(); const groups = []; let currentGroup; let currentSubgroup; let currentRows;
for (const line of input.toString('utf8').split(/\r?\n/)) {
  if (line.startsWith('# group:')) currentGroup = line.slice(8).trim();
  else if (line.startsWith('# subgroup:')) { currentSubgroup = line.slice(11).trim(); currentRows = []; groups.push([currentGroup, currentSubgroup, currentRows]); }
  else {
    const match = line.match(/^([0-9A-F ]+)\s*;\s*(fully-qualified|minimally-qualified|unqualified)\s*#\s+\S+\s+E[0-9.]+\s+(.+)$/);
    if (!match) continue;
    const glyph = match[1].trim().split(/\s+/).map(hex => String.fromCodePoint(parseInt(hex, 16))).join('');
    const name = match[3].replace(/: (?=[^:]*skin tone)[^:]+$/, '');
    if (!nameIds.has(name)) { nameIds.set(name, names.length); names.push(name); }
    currentRows.push(`${glyph}=${nameIds.get(name).toString(36)}${match[2] === 'fully-qualified' ? '!' : ''}`);
  }
}
const compactGroups = groups.filter(([, , rows]) => rows.length).map(([group, subgroup, rows]) => [group, subgroup, rows.join(' ')]);
const data = `// Generated from Unicode Emoji ${version}: ${url}\n// Unicode data is subject to UNICODE-LICENSE.txt. Do not edit by hand.\nexport const unicodeVersion = '${version}';\nexport const names = ${JSON.stringify(names)};\nexport const subgroups = ${JSON.stringify(compactGroups)};\n`;
await writeFile(new URL('../src/unicode-data.js', import.meta.url), data);
console.log(`Generated ${compactGroups.reduce((count, [, , rows]) => count + rows.split(' ').length, 0)} entries, ${Buffer.byteLength(data)} bytes, ${gzipSync(data).length} gzip bytes`);
