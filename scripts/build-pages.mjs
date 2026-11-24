import { cpSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('.openapi-build/site/apps/openapi');
const reference = resolve(root, 'openapi');
mkdirSync(reference, { recursive: true });
cpSync(resolve('public/openapi/index.html'), resolve(reference, 'index.html'));
cpSync(resolve(root, 'docs.json'), resolve(reference, 'docs.json'));
for (const file of ['index.html', 'landing.css']) {
  cpSync(resolve('site', file), resolve(root, file));
}
cpSync(resolve('site/animation/dist'), resolve(root, 'workflow'), { recursive: true });

const notices = ['API Contract Kit animated example\n', 'Source: svazqz/api-contract-kit-animations at 5c2a3159558a652d83501d8058b6deeeae7839b6.\n'];
const modules = resolve('site/animation/node_modules');
const packages = JSON.parse(readFileSync('site/animation/package-lock.json', 'utf8')).packages;
for (const [entry, metadata] of Object.entries(packages)) {
  if (!entry.startsWith('node_modules/') || metadata.dev) continue;
  const dir = resolve(modules, entry.slice('node_modules/'.length));
  let files;
  try { files = readdirSync(dir); } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }
  for (const file of files.filter(name => /^(licen[cs]e|notice|copying)([.-]|$)/i.test(name))) {
    notices.push('\n--- ' + entry + '/' + file + ' ---\n', readFileSync(resolve(dir, file), 'utf8'));
  }
}
writeFileSync(resolve(root, 'third-party-notices.txt'), notices.join('\n'));
