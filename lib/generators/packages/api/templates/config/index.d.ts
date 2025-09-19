import { ProjectConfig } from '../../../../../types/features';
export interface ConfigTemplateParams {
    config: ProjectConfig;
    features: ProjectConfig['features'];
}
export * from './package-json.js';
export * from './pyproject-toml.js';
export * from './readme.js';
