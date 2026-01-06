import { ConfigTemplateParams } from '.';
/**
 * Generates the database service definition for Docker Compose
 * @param params - Template parameters including config
 * @param serviceName - Normalized service name (e.g., "my-chatbot-db")
 * @returns YAML string for the db service definition
 */
export declare const generateDbService: (params: ConfigTemplateParams, serviceName: string) => string;
/**
 * Generates the database volume definition for Docker Compose
 * @param params - Template parameters including config
 * @returns YAML string for the volume definition
 */
export declare const generateDbVolume: (params: ConfigTemplateParams) => string;
