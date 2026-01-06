/**
 * Generates UI service template
 */
export function generateServiceUi(params) {
    const { config } = params;
    const chartName = config.name;
    return `{{- if .Values.ui.enabled }}
apiVersion: v1
kind: Service
metadata:
  name: {{ .Values.ui.name }}
  labels:
    {{- include "${chartName}.ui.labels" . | nindent 4 }}
spec:
  type: {{ .Values.ui.service.type }}
  ports:
    - port: {{ .Values.ui.service.port }}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    {{- include "${chartName}.ui.selectorLabels" . | nindent 4 }}
{{- end }}
`;
}
