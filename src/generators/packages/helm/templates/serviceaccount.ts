import { HelmTemplateParams } from './index.js';

/**
 * Generates ServiceAccount template
 */
export function generateServiceAccount(params: HelmTemplateParams): string {
  const { config } = params;
  const chartName = config.name;
  
  return `{{- if .Values.serviceAccount.create -}}
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ include "${chartName}.serviceAccountName" . }}
  labels:
    {{- include "${chartName}.labels" . | nindent 4 }}
  {{- with .Values.serviceAccount.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
{{- end }}
`;
}

