import { ProjectConfig } from '../../../../../types/features';

export interface ConfigTemplateParams {
  config: ProjectConfig;
  features: ProjectConfig['features'];
}

export * from './package-json.js';
export * from './storybook.js';
export * from './styles.js';
export * from './tsconfig.js';
export * from './vite.js';
export * from './components-json.js';
export * from './eslint-config.js';
export * from './prettierrc.js';
