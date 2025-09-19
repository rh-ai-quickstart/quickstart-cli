import { ProjectConfig } from '../../../../types/features.js';

export function generatePrettierPackageJson(config: ProjectConfig): string {
  const { name } = config;
  
  return `{
  "name": "@${name}/prettier-config",
  "version": "0.0.0",
  "private": true,
  "main": "index.json",
  "license": "MIT"
}
`;
}
