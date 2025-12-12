import { ConfigTemplateParams } from './config/index.js';
/**
 * Generates Containerfile for API package
 * Multi-stage build with Python 3.11+, uv, FastAPI, uvicorn
 */
export declare function generateContainerfile(params: ConfigTemplateParams): string;
