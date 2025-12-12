import { ConfigTemplateParams } from './config/index.js';
/**
 * Generates Containerfile for DB package (migrations)
 * Multi-stage build with Python 3.11+, uv, Alembic
 */
export declare function generateContainerfile(params: ConfigTemplateParams): string;
