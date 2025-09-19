import { ProjectConfig } from '../../../../../types/features';
export interface MigrationTemplateParams {
    config: ProjectConfig;
    features: ProjectConfig['features'];
}
export * from './alembic-env.js';
export * from './alembic-script.js';
