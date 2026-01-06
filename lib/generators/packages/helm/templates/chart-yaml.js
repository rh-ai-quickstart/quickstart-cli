/**
 * Generates Chart.yaml for Helm chart
 */
export function generateChartYaml(params) {
    const { config, features } = params;
    const hasDb = features.db;
    const dependencies = hasDb ? `dependencies:
  - name: pgvector
    version: 0.1.0
    repository: https://rh-ai-quickstart.github.io/ai-architecture-charts
    condition: pgvector.enabled
` : '';
    return `apiVersion: v2
name: ${config.name}
description: ${config.description || `Helm chart for ${config.name}`}
type: application
version: 0.1.0
appVersion: "latest"
${dependencies}keywords:
  - ${config.name}
home: https://github.com/example/${config.name}
sources:
  - https://github.com/example/${config.name}
maintainers:
  - name: Development Team
    email: dev@example.com
`;
}
