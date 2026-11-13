import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

test('local demo serves syntax highlighter assets', async () => {
  const server = spawn(process.execPath, ['demo/server.js'], { env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    const [chunk] = await once(server.stdout, 'data', { signal: AbortSignal.timeout(5000) });
    const url = chunk.toString().match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
    assert.ok(url, 'demo server must report its address');
    for (const path of ['/demo/vendor/prism.js', '/demo/vendor/prism-jsx.js']) {
      const response = await fetch(url + path);
      assert.equal(response.status, 200, `${path} should load`);
      assert.match(response.headers.get('content-type'), /javascript/);
      assert.ok((await response.text()).length > 100);
    }
  } finally {
    server.kill();
    await once(server, 'exit');
  }
});
