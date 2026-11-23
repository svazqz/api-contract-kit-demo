import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const baseURL = 'http://127.0.0.1:4173';
export default defineConfig({
  testDir: '.',
  workers: 2,
  reporter: 'list',
  use: { baseURL, browserName: 'chromium', headless: true },
  webServer: {
    cwd: fileURLToPath(new URL('../..', import.meta.url)),
    command: 'npm start -- --hostname 127.0.0.1 --port 4173',
    url: baseURL,
    reuseExistingServer: false,
    stderr: "pipe",
  },
});
