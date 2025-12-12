/**
 * Generates Database service template
 */
export function generateServiceDb(params) {
    const { config } = params;
    const chartName = config.name;
    return `{{- if .Values.database.enabled }}
apiVersion: v1
kind: Service
metadata:
  name: {{ .Values.database.name }}
  labels:
    {{- include "${chartName}.database.labels" . | nindent 4 }}
spec:
  type: {{ .Values.database.service.type }}
  ports:
    - port: {{ .Values.database.service.port }}
      targetPort: postgres
      protocol: TCP
      name: postgres
  selector:
    {{- include "${chartName}.database.selectorLabels" . | nindent 4 }}
{{- end }}
`;
}
