/**
 * Name normalization utilities for generating consistent service names
 */
/**
 * Normalizes a project name for use in service names, volume names, etc.
 * Converts to lowercase, replaces spaces and multiple hyphens with single hyphens,
 * and trims leading/trailing hyphens.
 *
 * @param name - The project name to normalize
 * @returns Normalized name (e.g., "My Chatbot" → "my-chatbot")
 */
export declare function normalizeName(name: string): string;
/**
 * Generates a service name in the format [project-name]-[package]
 *
 * @param projectName - The project name
 * @param packageId - The package identifier (e.g., 'db', 'api', 'ui')
 * @returns Normalized service name (e.g., "My Chatbot" + "db" → "my-chatbot-db")
 */
export declare function normalizeServiceName(projectName: string, packageId: string): string;
/**
 * Generates a volume name with project prefix
 *
 * @param projectName - The project name
 * @param volumeName - The volume name suffix
 * @returns Normalized volume name (e.g., "My Chatbot" + "postgres_data" → "my_chatbot_postgres_data")
 */
export declare function normalizeVolumeName(projectName: string, volumeName: string): string;
