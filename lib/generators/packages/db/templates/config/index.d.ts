import { ProjectConfig } from '../../../../../types/features';
export interface ConfigTemplateParams {
    config: ProjectConfig;
    features: ProjectConfig['features'];
}
export * from './package-json.js';
export * from './pyproject-toml.js';
export * from './podman-compose.js';
export * from './alembic-config.js';
export * from './readme.js';
