#!/bin/sh
set -eu
export NEXT_TELEMETRY_DISABLED=1
workdir=$(mktemp -d)
trap 'rm -rf "$workdir"' EXIT
tar -C /src --exclude=./.git --exclude=node_modules --exclude=./.next --exclude=./.openapi-build \
  --exclude=./.env --exclude=./.env.local -cf - . | tar -C "$workdir" -xf -
cd "$workdir"

npm ci --no-audit --no-fund
node --experimental-test-coverage --test-coverage-include='src/lib/api/demo-*.ts' \
  --test-coverage-lines=95 --test tests/demo-data.test.mjs
npm run typecheck
npm run generate:openapi
npm run lint
npm run build
npm ci --prefix tests/browser --no-audit --no-fund
tests/browser/node_modules/.bin/playwright test --config tests/browser/playwright.config.mjs
