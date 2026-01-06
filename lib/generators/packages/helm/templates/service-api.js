/**
 * Generates API service template
 */
export function generateServiceApi(params) {
    const { config } = params;
    const chartName = config.name;
    return `{{- if .Values.api.enabled }}
apiVersion: v1
kind: Service
metadata:
  name: {{ .Values.api.name }}
  labels:
    {{- include "${chartName}.api.labels" . | nindent 4 }}
spec:
  type: {{ .Values.api.service.type }}
  ports:
    - port: {{ .Values.api.service.port }}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    {{- include "${chartName}.api.selectorLabels" . | nindent 4 }}
{{- end }}
`;
}
