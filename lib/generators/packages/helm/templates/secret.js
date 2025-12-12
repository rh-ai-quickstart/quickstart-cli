/**
 * Generates Kubernetes Secret template
 */
export function generateSecret(params) {
    const { config, features } = params;
    const chartName = config.name;
    const hasApi = features.api;
    const hasUi = features.ui;
    const hasDb = features.db;
    const secretKeys = [];
    if (hasDb) {
        secretKeys.push('  # Database environment variables');
        secretKeys.push('  POSTGRES_DB: {{ .Values.secrets.POSTGRES_DB | toString | b64enc | quote }}');
        secretKeys.push('  POSTGRES_USER: {{ .Values.secrets.POSTGRES_USER | toString | b64enc | quote }}');
        secretKeys.push('  POSTGRES_PASSWORD: {{ .Values.secrets.POSTGRES_PASSWORD | toString | b64enc | quote }}');
        secretKeys.push('');
    }
    if (hasApi) {
        secretKeys.push('  # API environment variables');
        if (hasDb) {
            secretKeys.push('  DATABASE_URL: {{ .Values.secrets.DATABASE_URL | toString | b64enc | quote }}');
        }
        secretKeys.push('  DEBUG: {{ .Values.secrets.DEBUG | toString | b64enc | quote }}');
        secretKeys.push('  ALLOWED_HOSTS: {{ .Values.secrets.ALLOWED_HOSTS | toString | b64enc | quote }}');
        secretKeys.push('');
    }
    if (hasUi) {
        secretKeys.push('  # UI environment variables');
        secretKeys.push('  VITE_API_BASE_URL: {{ .Values.secrets.VITE_API_BASE_URL | toString | b64enc | quote }}');
        secretKeys.push('  VITE_ENVIRONMENT: {{ .Values.secrets.VITE_ENVIRONMENT | toString | b64enc | quote }}');
    }
    return `apiVersion: v1
kind: Secret
metadata:
  name: {{ include "${chartName}.fullname" . }}-secret
  labels:
    {{- include "${chartName}.labels" . | nindent 4 }}
type: Opaque
data:
${secretKeys.join('\n')}
`;
}
