import { ConfigTemplateParams } from './index.js';

/**
 * Generates .env.example file with all required environment variables
 * Based on enabled features (DB, API, UI)
 */
export function generateEnvExample(params: ConfigTemplateParams): string {
  const { config } = params;
  const enabledFeatures = Object.entries(config.features)
    .filter(([_, enabled]) => enabled)
    .map(([featureId, _]) => featureId);

  const hasApi = enabledFeatures.includes('api');
  const hasUi = enabledFeatures.includes('ui');
  const hasDb = enabledFeatures.includes('db');

  const sections: string[] = [];

  // Header
  sections.push('# Environment Variables');
  sections.push('# Copy this file to .env and fill in your actual values');
  sections.push('# Never commit .env to version control');
  sections.push('');

  // Database section
  if (hasDb) {
    sections.push('# Database Configuration');
    sections.push(`POSTGRES_DB=${config.name}`);
    sections.push('POSTGRES_USER=user');
    sections.push('POSTGRES_PASSWORD=changeme');
    sections.push(`DATABASE_URL=postgresql+asyncpg://user:changeme@localhost:5432/${config.name}`);
    sections.push('DB_ECHO=false');
    sections.push('');
  }

  // API section
  if (hasApi) {
    sections.push('# API Configuration');
    sections.push('DEBUG=true');
    sections.push('ALLOWED_HOSTS=["http://localhost:5173"]');
    sections.push('');
  }

  // UI section
  if (hasUi) {
    sections.push('# UI Configuration');
    sections.push('VITE_API_BASE_URL=http://localhost:8000');
    sections.push('VITE_ENVIRONMENT=development');
    sections.push('');
  }

  // OpenShift/Deployment section (if any containerized packages)
  if (hasApi || hasUi) {
    sections.push('# OpenShift/Deployment Configuration');
    sections.push('# These are used by make deploy');
    sections.push('# REGISTRY_URL is auto-detected from oc registry info if not set');
    sections.push('# REGISTRY_URL=default-route-openshift-image-registry.apps.example.com');
    sections.push(`NAMESPACE=${config.name}`);
    sections.push('IMAGE_TAG=latest');
    sections.push('');
  }

  return sections.join('\n');
}

