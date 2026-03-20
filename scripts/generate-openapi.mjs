import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { OpenApiGeneratorV3, OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

const indexPathArg = process.argv[2];
const outPathArg = process.argv[3] ?? '.openapi-build/site';
const pathPrefix = process.argv[4] ?? '/api';

if (!indexPathArg) {
  throw new Error('Missing compiled API index path');
}

extendZodWithOpenApi(z);

const cwd = process.cwd();
const indexPath = path.resolve(cwd, indexPathArg);
const outPath = path.resolve(cwd, outPathArg);
const require = createRequire(import.meta.url);
const apiDefinitions = require(indexPath);

const registry = new OpenAPIRegistry();

Object.entries(apiDefinitions).forEach(([, namespace]) => {
  Object.values(namespace).forEach((definition) => {
    const currentPath = definition.apiConfig.path ?? '';
    const nextPath = currentPath.startsWith(pathPrefix)
      ? currentPath
      : `${pathPrefix}${definition.endpoint ?? definition.path ?? ''}`;
    registry.registerPath({
      ...definition.apiConfig,
      path: nextPath,
    });
  });
});

const generator = new OpenApiGeneratorV3(registry.definitions);
const result = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'API Definition',
    version: '1.0.0',
  },
});

const outputDir = path.join(outPath, 'apps/openapi');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'docs.json'), JSON.stringify(result, null, 2), 'utf8');
