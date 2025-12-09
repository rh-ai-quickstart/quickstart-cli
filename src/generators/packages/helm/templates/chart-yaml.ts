import { HelmTemplateParams } from './index.js';

/**
 * Generates Chart.yaml for Helm chart
 */
export function generateChartYaml(params: HelmTemplateParams): string {
  const { config } = params;
  
  return `apiVersion: v2
name: ${config.name}
description: ${config.description || `Helm chart for ${config.name}`}
type: application
version: 0.1.0
appVersion: "latest"
keywords:
  - ${config.name}
home: https://github.com/example/${config.name}
sources:
  - https://github.com/example/${config.name}
maintainers:
  - name: Development Team
    email: dev@example.com
`;
}

