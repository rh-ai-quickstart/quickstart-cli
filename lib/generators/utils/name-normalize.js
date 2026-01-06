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
export function normalizeName(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
/**
 * Generates a service name in the format [project-name]-[package]
 *
 * @param projectName - The project name
 * @param packageId - The package identifier (e.g., 'db', 'api', 'ui')
 * @returns Normalized service name (e.g., "My Chatbot" + "db" → "my-chatbot-db")
 */
export function normalizeServiceName(projectName, packageId) {
    const normalized = normalizeName(projectName);
    return `${normalized}-${packageId}`;
}
/**
 * Generates a volume name with project prefix
 *
 * @param projectName - The project name
 * @param volumeName - The volume name suffix
 * @returns Normalized volume name (e.g., "My Chatbot" + "postgres_data" → "my_chatbot_postgres_data")
 */
export function normalizeVolumeName(projectName, volumeName) {
    const normalized = normalizeName(projectName);
    return `${normalized}_${volumeName}`;
}
