import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const appUrl = `file:///${projectRoot.replace(/\\/g, '/')}/index.html?smoke=1`;
const remoteDebuggingPort = 9222;
const userDataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'local-pdf-toolkit-smoke-'));

const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--allow-file-access-from-files',
  `--remote-debugging-port=${remoteDebuggingPort}`,
  `--user-data-dir=${userDataDir}`,
  'about:blank',
], {
  windowsHide: true,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let stderr = '';
chrome.stderr.on('data', (chunk) => {
  stderr += chunk.toString();
});

try {
  const wsUrl = await getPageWebSocketDebuggerUrl(remoteDebuggingPort);
  const cdp = await connectToCdp(wsUrl);
  const runtimeExceptions = [];

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  cdp.on('Runtime.exceptionThrown', (params) => {
    runtimeExceptions.push(params);
  });
  await cdp.send('Page.navigate', { url: appUrl });
  await cdp.waitFor('Page.loadEventFired', 15000);

  const result = await waitForSmokeResult(cdp, 20000, runtimeExceptions);
  assert.equal(result.status, 'pass', `Browser smoke test failed: ${JSON.stringify(result)}`);
  console.log(`PASS browser smoke test (${result.importedSources} sources, ${result.importedPages} pages, ${result.stampedPages} stamped)`);

  await cdp.close();
} catch (error) {
  console.error('FAIL browser smoke test');
  console.error(error.stack || error.message);
  if (stderr.trim()) {
    console.error(stderr.trim());
  }
  process.exitCode = 1;
} finally {
  await closeChrome(chrome);
  await fs.rm(userDataDir, { recursive: true, force: true });
}

async function getPageWebSocketDebuggerUrl(port) {
  const started = Date.now();
  while (Date.now() - started < 10000) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (response.ok) {
        const payload = await response.json();
        const pageTarget = payload.find((item) => item.type === 'page' && item.webSocketDebuggerUrl);
        if (pageTarget) {
          return pageTarget.webSocketDebuggerUrl;
        }
      }
    } catch {}
    await delay(250);
  }
  throw new Error('Chrome page debugging endpoint did not become available.');
}

async function connectToCdp(wsUrl) {
  const socket = new WebSocket(wsUrl);
  const pending = new Map();
  const listeners = new Map();
  let commandId = 0;

  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) {
        reject(new Error(message.error.message || 'CDP command failed.'));
      } else {
        resolve(message.result || {});
      }
      return;
    }

    if (message.method && listeners.has(message.method)) {
      for (const listener of listeners.get(message.method)) {
        listener(message.params || {});
      }
    }
  });

  return {
    send(method, params = {}) {
      const id = ++commandId;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
    on(method, handler) {
      if (!listeners.has(method)) {
        listeners.set(method, new Set());
      }
      listeners.get(method).add(handler);
      return () => {
        const set = listeners.get(method);
        if (!set) {
          return;
        }
        set.delete(handler);
        if (set.size === 0) {
          listeners.delete(method);
        }
      };
    },
    waitFor(method, timeoutMs) {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          unsubscribe();
          reject(new Error(`Timed out waiting for ${method}.`));
        }, timeoutMs);

        const handler = (params) => {
          clearTimeout(timeout);
          unsubscribe();
          resolve(params);
        };

        const unsubscribe = this.on(method, handler);
      });
    },
    async close() {
      socket.close();
      await delay(100);
    },
  };
}

async function waitForSmokeResult(cdp, timeoutMs, runtimeExceptions = []) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const evaluation = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const node = document.getElementById('smoke-result');
        if (!node) return null;
        return {
          status: node.dataset.status || '',
          text: node.textContent || '',
          uiStatus: document.getElementById('status')?.textContent || ''
        };
      })()`,
      returnByValue: true,
      awaitPromise: true,
    });

    const value = evaluation.result?.value;
    if (value?.status) {
      return JSON.parse(value.text);
    }

    await delay(250);
  }

  const statusDump = await cdp.send('Runtime.evaluate', {
    expression: `document.getElementById('status')?.textContent || ''`,
    returnByValue: true,
  });
  const latestException = runtimeExceptions.at(-1);
  const exceptionText = latestException?.exceptionDetails?.exception?.description || latestException?.exceptionDetails?.text || 'none';
  throw new Error(`Smoke result was not produced. UI status: ${statusDump.result?.value || 'unknown'}. Runtime exception: ${exceptionText}`);
}

async function closeChrome(chromeProcess) {
  if (chromeProcess.exitCode !== null) {
    return;
  }
  chromeProcess.kill();
  await new Promise((resolve) => chromeProcess.once('exit', resolve));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
