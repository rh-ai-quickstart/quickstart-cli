import { HelmTemplateParams } from './index.js';

/**
 * Generates PersistentVolumeClaim template for database
 */
export function generateDatabasePvc(params: HelmTemplateParams): string {
  const { config } = params;
  const chartName = config.name;
  
  return `{{- if and .Values.database.enabled .Values.database.persistence.enabled }}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ .Values.database.name }}-pvc
  labels:
    {{- include "${chartName}.database.labels" . | nindent 4 }}
spec:
  accessModes:
    - {{ .Values.database.persistence.accessMode }}
  {{- if .Values.global.storageClass }}
  storageClassName: {{ .Values.global.storageClass }}
  {{- end }}
  resources:
    requests:
      storage: {{ .Values.database.persistence.size }}
{{- end }}
`;
}

