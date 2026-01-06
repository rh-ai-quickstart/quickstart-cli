import { HelmTemplateParams } from './index.js';

/**
 * Generates values.yaml for Helm chart
 */
export function generateValuesYaml(params: HelmTemplateParams): string {
  const { config, features } = params;
  const chartName = config.name;
  
  const hasApi = features.api;
  const hasUi = features.ui;
  const hasDb = features.db;
  
  // Build secrets section based on enabled features
  const secrets: string[] = [];
  
  if (hasDb) {
    secrets.push('  # Database secrets');
    secrets.push('  POSTGRES_DB: "' + chartName + '"');
    secrets.push('  POSTGRES_USER: "user"');
    secrets.push('  POSTGRES_PASSWORD: "changeme"');
    secrets.push('');
  }
  
  if (hasApi) {
    secrets.push('  # API secrets');
    // Note: DATABASE_URL is constructed dynamically from database.* values in the secret template
    secrets.push('  DEBUG: "false"');
    secrets.push('  ALLOWED_HOSTS: "*"');
    secrets.push('');
  }
  
  if (hasUi) {
    secrets.push('  # UI secrets');
    secrets.push('  VITE_API_BASE_URL: "http://localhost:8000"');
    secrets.push('  VITE_ENVIRONMENT: "production"');
    secrets.push('');
  }
  
  // Build component sections
  const apiSection = hasApi ? `# API configuration
api:
  enabled: true
  name: ${chartName}-api
  image:
    repository: ${chartName}-api
    tag: latest
  service:
    type: ClusterIP
    port: 8000
  replicas: 1
  resources:
    requests:
      memory: "512Mi"
      cpu: "250m"
    limits:
      memory: "1Gi"
      cpu: "1000m"
  healthCheck:
    enabled: true
    path: /health
    initialDelaySeconds: 30
    periodSeconds: 10
` : '';
  
  const uiSection = hasUi ? `# UI configuration
ui:
  enabled: true
  name: ${chartName}-ui
  image:
    repository: ${chartName}-ui
    tag: latest
  service:
    type: ClusterIP
    port: 8080
  replicas: 1
  resources:
    requests:
      memory: "128Mi"
      cpu: "100m"
    limits:
      memory: "256Mi"
      cpu: "500m"
  healthCheck:
    enabled: true
    path: /
    initialDelaySeconds: 10
    periodSeconds: 10
` : '';
  
  const dbSection = hasDb ? `# Database configuration using pgvector subchart
# Source: https://github.com/rh-ai-quickstart/ai-architecture-charts/tree/main/pgvector
# The subchart deploys PostgreSQL with pgvector extension for vector search
pgvector:
  enabled: true
  # Database credentials (used by subchart and application templates)
  secret:
    host: pgvector    # Service name created by subchart
    port: "5432"
    dbname: ${chartName}
    user: postgres
    password: changeme  # Change in production!
  # Storage configuration
  persistence:
    enabled: true
    size: 10Gi
    accessMode: ReadWriteOnce
  # Resource limits
  resources:
    requests:
      memory: "256Mi"
      cpu: "100m"
    limits:
      memory: "512Mi"
      cpu: "500m"
` : '';
  
  const migrationSection = hasDb ? `# Database migration configuration
migration:
  enabled: true
  name: ${chartName}-migration
  image:
    repository: ${chartName}-db
    tag: latest
  restartPolicy: Never
  backoffLimit: 1
  ttlSecondsAfterFinished: 86400
  resources:
    requests:
      memory: "1Gi"
      cpu: "250m"
    limits:
      memory: "2Gi"
      cpu: "1000m"
` : '';
  
  return `# Default values for ${chartName}
global:
  imageRegistry: quay.io
  imageRepository: ${chartName}
  imageTag: latest
  imagePullPolicy: Always
  storageClass: ""

# Secrets configuration - these values should be overridden with actual secrets
secrets:
${secrets.join('\n')}# OpenShift Routes configuration
routes:
  enabled: true
  annotations: {}
  sharedHost: ""  # Set custom hostname or leave empty (will use ui.host fallback)
  ui:
    host: ""  # Used as fallback if sharedHost is empty
    tls:
      enabled: true
      termination: edge
      insecureEdgeTerminationPolicy: Redirect
  api:
    host: ""  # Ignored - uses sharedHost or ui.host
    tls:
      enabled: true
      termination: edge
      insecureEdgeTerminationPolicy: Redirect

${apiSection}${uiSection}${dbSection}${migrationSection}# ServiceAccount
serviceAccount:
  create: true
  annotations: {}
  name: ""

# Pod Security Context
podSecurityContext: {}

# Security Context
securityContext:
  allowPrivilegeEscalation: false
  capabilities:
    drop:
    - ALL
  readOnlyRootFilesystem: false
  runAsNonRoot: true
  seccompProfile:
    type: RuntimeDefault

# Node selector
nodeSelector: {}

# Tolerations
tolerations: []

# Affinity
affinity: {}
`;
}

