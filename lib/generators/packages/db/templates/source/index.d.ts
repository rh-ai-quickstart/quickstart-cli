import { ProjectConfig } from '../../../../../types/features';
export interface SourceTemplateParams {
    config: ProjectConfig;
    features: ProjectConfig['features'];
}
export * from './database-module.js';
export * from './init-file.js';
