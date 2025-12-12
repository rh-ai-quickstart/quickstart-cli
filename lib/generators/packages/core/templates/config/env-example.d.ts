import { ConfigTemplateParams } from './index.js';
/**
 * Generates .env.example file with all required environment variables
 * Based on enabled features (DB, API, UI)
 */
export declare function generateEnvExample(params: ConfigTemplateParams): string;
