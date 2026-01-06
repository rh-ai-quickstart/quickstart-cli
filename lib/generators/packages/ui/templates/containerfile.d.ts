import { ConfigTemplateParams } from './config/index.js';
/**
 * Generates Containerfile for UI package
 * Multi-stage build: Node.js for building, nginx for serving
 */
export declare function generateContainerfile(params: ConfigTemplateParams): string;
