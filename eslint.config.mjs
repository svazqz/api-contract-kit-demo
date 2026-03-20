import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const config = [
  {
    ignores: ['.openapi-build/**', '.next/**', 'node_modules/**'],
  },
  ...nextVitals,
  ...nextTs,
];

export default config;
