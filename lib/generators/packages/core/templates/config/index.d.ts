import { ProjectConfig } from '../../../../../types/features.js';
export interface ConfigTemplateParams {
    config: ProjectConfig;
}
export * from './package-json.js';
export * from './turbo-json.js';
export * from './pnpm-workspace.js';
export * from './readme.js';
export * from './gitignore.js';
export * from './releaserc.js';
export * from './commitlint.js';
export * from './husky.js';
export * from './pull-request-template.js';
