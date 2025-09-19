import { ProjectConfig } from '../../../../../types/features';

export interface TestTemplateParams {
  config: ProjectConfig;
  features: ProjectConfig['features'];
}

export * from './database-tests.js';