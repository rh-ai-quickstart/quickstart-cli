import { ProjectConfig } from '../../../../../types/features';
export interface SourceTemplateParams {
    config: ProjectConfig;
    features: ProjectConfig['features'];
}
export * from './init-file.js';
export * from './main-file.js';
