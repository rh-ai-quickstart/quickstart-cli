/**
 * Generates _helpers.tpl with reusable template functions
 */
export function generateHelpersTpl(params) {
    const { config } = params;
    const chartName = config.name;
    return `{{/*
Expand the name of the chart.
*/}}
{{- define "${chartName}.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "${chartName}.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "${chartName}.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "${chartName}.labels" -}}
helm.sh/chart: {{ include "${chartName}.chart" . }}
{{ include "${chartName}.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "${chartName}.selectorLabels" -}}
app.kubernetes.io/name: {{ include "${chartName}.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "${chartName}.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "${chartName}.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Image name helper
*/}}
{{- define "${chartName}.image" -}}
{{- $registry := .Values.global.imageRegistry -}}
{{- $repository := .Values.global.imageRepository -}}
{{- $name := .name -}}
{{- $tag := .tag | default .Values.global.imageTag -}}
{{- printf "%s/%s/%s:%s" $registry $repository $name $tag -}}
{{- end }}

{{/*
API labels
*/}}
{{- define "${chartName}.api.labels" -}}
{{ include "${chartName}.labels" . }}
app.kubernetes.io/component: api
{{- end }}

{{/*
API selector labels
*/}}
{{- define "${chartName}.api.selectorLabels" -}}
{{ include "${chartName}.selectorLabels" . }}
app.kubernetes.io/component: api
{{- end }}

{{/*
UI labels
*/}}
{{- define "${chartName}.ui.labels" -}}
{{ include "${chartName}.labels" . }}
app.kubernetes.io/component: ui
{{- end }}

{{/*
UI selector labels
*/}}
{{- define "${chartName}.ui.selectorLabels" -}}
{{ include "${chartName}.selectorLabels" . }}
app.kubernetes.io/component: ui
{{- end }}

{{/*
Database labels
*/}}
{{- define "${chartName}.database.labels" -}}
{{ include "${chartName}.labels" . }}
app.kubernetes.io/component: database
{{- end }}

{{/*
Database selector labels
*/}}
{{- define "${chartName}.database.selectorLabels" -}}
{{ include "${chartName}.selectorLabels" . }}
app.kubernetes.io/component: database
{{- end }}

{{/*
Migration labels
*/}}
{{- define "${chartName}.migration.labels" -}}
{{ include "${chartName}.labels" . }}
app.kubernetes.io/component: migration
{{- end }}

{{/*
Migration selector labels
*/}}
{{- define "${chartName}.migration.selectorLabels" -}}
{{ include "${chartName}.selectorLabels" . }}
app.kubernetes.io/component: migration
{{- end }}
`;
}
