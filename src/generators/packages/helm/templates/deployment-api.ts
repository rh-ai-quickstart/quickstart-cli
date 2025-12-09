import { HelmTemplateParams } from './index.js';

/**
 * Generates API deployment template
 */
export function generateDeploymentApi(params: HelmTemplateParams): string {
  const { config } = params;
  const chartName = config.name;
  
  return `{{- if .Values.api.enabled }}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Values.api.name }}
  labels:
    {{- include "${chartName}.api.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.api.replicas }}
  selector:
    matchLabels:
      {{- include "${chartName}.api.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "${chartName}.api.selectorLabels" . | nindent 8 }}
    spec:
      serviceAccountName: {{ include "${chartName}.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
        - name: api
          securityContext:
            {{- toYaml .Values.securityContext | nindent 12 }}
          image: {{ include "${chartName}.image" (dict "name" .Values.api.image.repository "tag" .Values.api.image.tag "Values" .Values) }}
          imagePullPolicy: {{ .Values.global.imagePullPolicy }}
          ports:
            - name: http
              containerPort: 8000
              protocol: TCP
          env:
            {{- if .Values.database.enabled }}
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: {{ include "${chartName}.fullname" . }}-secret
                  key: DATABASE_URL
            {{- end }}
            - name: DEBUG
              valueFrom:
                secretKeyRef:
                  name: {{ include "${chartName}.fullname" . }}-secret
                  key: DEBUG
            - name: ALLOWED_HOSTS
              valueFrom:
                secretKeyRef:
                  name: {{ include "${chartName}.fullname" . }}-secret
                  key: ALLOWED_HOSTS
          {{- if .Values.api.healthCheck.enabled }}
          livenessProbe:
            httpGet:
              path: {{ .Values.api.healthCheck.path }}
              port: http
            initialDelaySeconds: {{ .Values.api.healthCheck.initialDelaySeconds }}
            periodSeconds: {{ .Values.api.healthCheck.periodSeconds }}
          readinessProbe:
            httpGet:
              path: {{ .Values.api.healthCheck.path }}
              port: http
            initialDelaySeconds: {{ .Values.api.healthCheck.initialDelaySeconds }}
            periodSeconds: {{ .Values.api.healthCheck.periodSeconds }}
          {{- end }}
          resources:
            {{- toYaml .Values.api.resources | nindent 12 }}
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
{{- end }}
`;
}

