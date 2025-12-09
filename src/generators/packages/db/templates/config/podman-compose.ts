import { ConfigTemplateParams } from '.';
import { normalizeServiceName, normalizeVolumeName } from '../../../../utils/name-normalize.js';

/**
 * Generates the database service definition for Docker Compose
 * @param params - Template parameters including config
 * @param serviceName - Normalized service name (e.g., "my-chatbot-db")
 * @returns YAML string for the db service definition
 */
export const generateDbService = (
  params: ConfigTemplateParams,
  serviceName: string
): string => {
  const { config } = params;
  const volumeName = normalizeVolumeName(config.name, 'postgres_data');
  
  return /* yaml */ `  ${serviceName}:
    image: docker.io/postgres:16
    labels:
      com.quickstart.package: db
    environment:
      POSTGRES_DB: ${config.name}
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - ${volumeName}:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d ${config.name}"]
      interval: 5s
      timeout: 5s
      retries: 5`;
};

/**
 * Generates the database volume definition for Docker Compose
 * @param params - Template parameters including config
 * @returns YAML string for the volume definition
 */
export const generateDbVolume = (params: ConfigTemplateParams): string => {
  const { config } = params;
  const volumeName = normalizeVolumeName(config.name, 'postgres_data');
  return `  ${volumeName}:`;
};
