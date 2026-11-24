import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const baseURL = 'http://127.0.0.1:4173';
export const pagesURL = 'http://127.0.0.1:4174';
const cwd = fileURLToPath(new URL('../..', import.meta.url));
export default defineConfig({
  testDir: '.',
  workers: 2,
  reporter: 'list',
  use: { baseURL, browserName: 'chromium', headless: true },
  webServer: [
    {
      cwd,
      command: 'npm start -- --hostname 127.0.0.1 --port 4173',
      url: baseURL,
      reuseExistingServer: false,
      stderr: 'pipe',
    },
    {
      cwd,
      command: 'npm exec --prefix site/animation -- vite preview site/animation --outDir ../../.openapi-build/site/apps/openapi --host 127.0.0.1 --port 4174 --strictPort',
      url: pagesURL,
      reuseExistingServer: false,
      stderr: 'pipe',
    },
  ],
});
