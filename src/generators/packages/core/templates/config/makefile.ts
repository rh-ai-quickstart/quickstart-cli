import { ConfigTemplateParams } from './index.js';
import { normalizeServiceName } from '../../../../utils/name-normalize.js';
import { runRecursiveScript, runWorkspaceScript } from '../../../../utils/package-manager.js';
import { PackageId } from '../../../../../types/features.js';

/**
 * Generates a Makefile with common project commands
 */

// Helper function to check if any of the enabled features match the given packages
const hasAnyPackage = (enabledFeatures: string[], packages: PackageId[]): boolean => {
  return packages.some((pkg) => enabledFeatures.includes(pkg));
};

// Helper function to check if a specific package is enabled
const hasPackage = (enabledFeatures: string[], pkg: PackageId): boolean => {
  return enabledFeatures.includes(pkg);
};

export const generateMakefile = (params: ConfigTemplateParams): string => {
  const { config } = params;
  const enabledFeatures = Object.entries(config.features)
    .filter(([_, enabled]) => enabled)
    .map(([featureId]) => featureId);

  // Package checks using generic approach
  const containerizedPackages: PackageId[] = ['api', 'ui'];
  const hasContainerizedPackages = hasAnyPackage(enabledFeatures, containerizedPackages);
  const hasApi = hasPackage(enabledFeatures, 'api');
  const hasUi = hasPackage(enabledFeatures, 'ui');
  const hasDb = hasPackage(enabledFeatures, 'db');
  
  const dbServiceName = hasDb ? normalizeServiceName(config.name, 'db') : '';

  // Use the package manager from config (user-selected)
  const pkgManager = config.packageManager;

  const targets: string[] = [];

  // Help target (default)
  targets.push(`help:
	@echo "Available targets:"
	@echo ""
	@echo "  setup              Install dependencies for all packages"
	@echo "  dev                Run dev command in each package to start necessary dev servers/containers"
	@echo "  build              Build all packages"
	@echo "  test               Run tests for all packages"
	@echo "  lint               Run linters for all packages"
${hasDb ? `	@echo "  db-start            Start the database container"
	@echo "  db-stop             Stop the database container"
	@echo "  db-logs             View database container logs"
	@echo "  db-upgrade          Run database migrations"` : ''}
	@echo "  containers-build   Build all container images"
	@echo "  containers-up      Start all containers"
	@echo "  containers-down    Stop all containers"
	@echo "  containers-logs     View logs for all containers"${hasContainerizedPackages ? `
	@echo "  build-images        Build API and UI container images"
	@echo "  push-images         Push images to OpenShift registry"` : ''}
	@echo "  deploy             Deploy application using Helm"
	@echo "  deploy-dev          Deploy in development mode"
	@echo "  undeploy            Remove application deployment"
	@echo "  status              Show deployment status"
	@echo "  debug               Show detailed diagnostics for failed deployments"
	@echo "  helm-lint           Lint Helm chart"
	@echo "  helm-template       Render Helm templates"
	@echo "  clean              Remove build artifacts and dependencies"
	@echo ""
	@echo "Run 'make <target>' to execute a target"`);

  // Setup target
  const setupInstallCmd = `${pkgManager} install`;
  const setupDepsCmd = runRecursiveScript(pkgManager, 'install:deps', true);
  targets.push(`setup:
	${setupInstallCmd}
	${setupDepsCmd}`);

  // Dev target - delegate to package manager which runs turbo
  targets.push(`dev:
	${pkgManager} dev`);

  // Build target
  targets.push(`build:
	${pkgManager} build`);

  // Test target
  targets.push(`test:
	${pkgManager} test`);

  // Lint target
  targets.push(`lint:
	${pkgManager} lint`);

  // DB targets
  if (hasDb) {
    targets.push(`db-start:
	podman-compose up -d ${dbServiceName}`);

    targets.push(`db-stop:
	podman-compose down ${dbServiceName}`);

    targets.push(`db-logs:
	podman-compose logs -f ${dbServiceName}`);

    targets.push(`db-upgrade:
	${runWorkspaceScript(pkgManager, `@${config.name}/db`, 'upgrade', true)}`);
  }

  // Container targets
  targets.push(`containers-build:
	podman-compose build`);

  targets.push(`containers-up:
	podman-compose up -d`);

  targets.push(`containers-down:
	podman-compose down`);

  targets.push(`containers-logs:
	podman-compose logs -f`);

  // Clean target
  targets.push(`clean:
	${pkgManager} clean
	rm -rf node_modules
	rm -rf packages/*/node_modules
	rm -rf packages/*/dist
	rm -rf packages/*/build
	rm -rf packages/*/__pycache__
	rm -rf packages/*/.pytest_cache`);

  // Deployment configuration
  const projectName = config.name;
  
  // Build and push image targets (only if containerized packages are enabled)
  if (hasContainerizedPackages) {
    // Build images target
    // Build from project root to include all dependencies (e.g., DB package for API)
    const buildImageCommands: string[] = [];
    if (hasApi) {
      buildImageCommands.push(`\t@echo "Building API image..."
\t@podman build -f packages/api/Containerfile -t ${projectName}-api:$(IMAGE_TAG) .`);
    }
    if (hasUi) {
      buildImageCommands.push(`\t@echo "Building UI image..."
\t@podman build -f packages/ui/Containerfile -t ${projectName}-ui:$(IMAGE_TAG) .`);
    }

    targets.push(`build-images:
${buildImageCommands.join('\n')}
\t@echo "✅ Images built successfully"`);

    // Push images target - combine into single shell block so REGISTRY_URL persists
    const pushImageParts: string[] = [];
    pushImageParts.push(`REGISTRY_URL="$(REGISTRY_URL)"`);
    pushImageParts.push(`if [ -z "$$REGISTRY_URL" ]; then REGISTRY_URL=$$(oc get route default-route -n openshift-image-registry -o jsonpath='{.spec.host}' 2>/dev/null || echo ""); fi`);
    pushImageParts.push(`if [ -z "$$REGISTRY_URL" ]; then CLUSTER_DOMAIN=$$(oc whoami --show-server 2>/dev/null | sed -E 's|https://api\\.([^:]+).*|apps.\\1|' || echo ""); if [ -n "$$CLUSTER_DOMAIN" ]; then REGISTRY_URL="default-route-openshift-image-registry.$$CLUSTER_DOMAIN"; fi; fi`);
    pushImageParts.push(`if [ -z "$$REGISTRY_URL" ]; then echo "Error: Could not detect OpenShift registry URL."; echo "Please set REGISTRY_URL manually: make push-images REGISTRY_URL=your-registry-url"; echo "Or ensure you're logged into OpenShift with 'oc login'"; exit 1; fi`);
    pushImageParts.push(`echo "Using registry: $$REGISTRY_URL"`);
    pushImageParts.push(`echo "Logging in to registry..."`);
    pushImageParts.push(`podman login -u $$(oc whoami) -p $$(oc whoami -t) $$REGISTRY_URL || exit 1`);
    pushImageParts.push(`echo "Ensuring image push permissions..."`);
    pushImageParts.push(`oc policy add-role-to-user system:image-builder $$(oc whoami) -n $(NAMESPACE) 2>/dev/null || echo "Permissions may already be set"`);

    if (hasApi) {
      pushImageParts.push(`echo "Tagging and pushing API image..."`);
      pushImageParts.push(`podman tag ${projectName}-api:$(IMAGE_TAG) $$REGISTRY_URL/$(NAMESPACE)/${projectName}-api:$(IMAGE_TAG)`);
      pushImageParts.push(`if ! podman push $$REGISTRY_URL/$(NAMESPACE)/${projectName}-api:$(IMAGE_TAG); then echo ""; echo "❌ Failed to push API image. Common solutions:"; echo "  1. Ensure you have push permissions: oc policy add-role-to-user system:image-builder $$(oc whoami) -n $(NAMESPACE)"; echo "  2. Check if namespace exists: oc get project $(NAMESPACE)"; echo "  3. Try creating the project: oc new-project $(NAMESPACE)"; exit 1; fi`);
    }
    if (hasUi) {
      pushImageParts.push(`echo "Tagging and pushing UI image..."`);
      pushImageParts.push(`podman tag ${projectName}-ui:$(IMAGE_TAG) $$REGISTRY_URL/$(NAMESPACE)/${projectName}-ui:$(IMAGE_TAG)`);
      pushImageParts.push(`if ! podman push $$REGISTRY_URL/$(NAMESPACE)/${projectName}-ui:$(IMAGE_TAG); then echo ""; echo "❌ Failed to push UI image. Common solutions:"; echo "  1. Ensure you have push permissions: oc policy add-role-to-user system:image-builder $$(oc whoami) -n $(NAMESPACE)"; echo "  2. Check if namespace exists: oc get project $(NAMESPACE)"; echo "  3. Try creating the project: oc new-project $(NAMESPACE)"; exit 1; fi`);
    }

    pushImageParts.push(`echo "✅ Images pushed successfully"`);

    // Check if images exist, build only if needed
    const imageCheckParts: string[] = [];
    imageCheckParts.push(`NEED_BUILD=false`);
    if (hasApi) {
      imageCheckParts.push(`if ! podman image exists ${projectName}-api:$(IMAGE_TAG); then echo "API image not found"; NEED_BUILD=true; fi`);
    }
    if (hasUi) {
      imageCheckParts.push(`if ! podman image exists ${projectName}-ui:$(IMAGE_TAG); then echo "UI image not found"; NEED_BUILD=true; fi`);
    }
    imageCheckParts.push(`if [ "$$NEED_BUILD" = "true" ]; then echo "Building missing images..."; $(MAKE) build-images; fi`);
    
    // Join all parts with && and format as single shell command block
    const pushImageCommand = pushImageParts.join(' && \\\n\t');
    const imageCheckCommand = imageCheckParts.join(' && \\\n\t') + ' && \\\n\t';
    targets.push(`push-images:
\t@${imageCheckCommand}${pushImageCommand}`);
  }
  
  // Build HELM_SECRET_PARAMS based on enabled features
  const helmSecretParams: string[] = [];
  if (hasDb) {
    helmSecretParams.push('--set secrets.POSTGRES_DB="$$POSTGRES_DB"');
    helmSecretParams.push('--set secrets.POSTGRES_USER="$$POSTGRES_USER"');
    helmSecretParams.push('--set secrets.POSTGRES_PASSWORD="$$POSTGRES_PASSWORD"');
    if (hasApi) {
      helmSecretParams.push('--set secrets.DATABASE_URL="$$DATABASE_URL"');
    }
  }
  if (hasApi) {
    helmSecretParams.push('--set secrets.DEBUG="$$DEBUG"');
    helmSecretParams.push('--set secrets.ALLOWED_HOSTS="$$ALLOWED_HOSTS"');
  }
  if (hasUi) {
    helmSecretParams.push('--set secrets.VITE_API_BASE_URL="$$VITE_API_BASE_URL"');
    helmSecretParams.push('--set secrets.VITE_ENVIRONMENT="$$VITE_ENVIRONMENT"');
  }
  
  const helmSecretParamsStr = helmSecretParams.join(' \\\n\t\t');

  // Deployment targets
  targets.push(`# Deployment configuration
PROJECT_NAME = ${projectName}
NAMESPACE ?= $(PROJECT_NAME)
${hasContainerizedPackages ? 'REGISTRY_URL ?= $(shell oc get route default-route -n openshift-image-registry -o jsonpath=\'{.spec.host}\' 2>/dev/null || echo "")' : 'REGISTRY_URL ?= quay.io'}
REPOSITORY ?= $(PROJECT_NAME)
IMAGE_TAG ?= latest
CLUSTER_DOMAIN ?= $(shell oc whoami --show-server 2>/dev/null | sed -E 's|https://api\\.([^:]+).*|apps.\\1|' || echo "")
HELM_TIMEOUT ?= 15m
HELM_WAIT ?= --wait
HELM_WAIT_FOR_JOBS ?= --wait-for-jobs

# Default to .env, but allow override
ENV_FILE ?= .env

# Helper function to generate helm parameters from environment variables
define HELM_SECRET_PARAMS
\t${helmSecretParamsStr}
endef

# Create OpenShift project/namespace if it doesn't exist
create-project:
	@echo "Creating OpenShift project: $(NAMESPACE)"
	@oc new-project $(NAMESPACE) || echo "Project $(NAMESPACE) already exists"

# Update Helm chart dependencies
helm-dep-update:
	@echo "Updating Helm chart dependencies..."
	@helm dependency update ./deploy/helm/$(PROJECT_NAME) || echo "No dependencies to update"
	@echo "✅ Helm dependencies updated successfully"

# Deploy application
deploy: create-project ${hasContainerizedPackages ? 'push-images ' : ''}helm-dep-update
	@echo "Deploying application using Helm..."
	@if [ -f "$(ENV_FILE)" ]; then \
		set -a; source $(ENV_FILE); set +a; \
	fi; \
	REGISTRY_URL="$(REGISTRY_URL)"; \
	if [ -z "$$REGISTRY_URL" ]; then \
		REGISTRY_URL=$$(oc get route default-route -n openshift-image-registry -o jsonpath='{.spec.host}' 2>/dev/null || echo ""); \
	fi; \
	if [ -z "$$REGISTRY_URL" ]; then \
		CLUSTER_DOMAIN=$$(oc whoami --show-server 2>/dev/null | sed -E 's|https://api\\.([^:]+).*|apps.\\1|' || echo ""); \
		if [ -n "$$CLUSTER_DOMAIN" ]; then REGISTRY_URL="default-route-openshift-image-registry.$$CLUSTER_DOMAIN"; fi; \
	fi; \
	if echo "$$REGISTRY_URL" | grep -q "\\.svc:"; then \
		REGISTRY_URL=$$(oc get route default-route -n openshift-image-registry -o jsonpath='{.spec.host}' 2>/dev/null || echo "$$REGISTRY_URL"); \
	fi; \
	helm upgrade --install $(PROJECT_NAME) ./deploy/helm/$(PROJECT_NAME) \\
		--namespace $(NAMESPACE) \\
		--timeout $(HELM_TIMEOUT) \\
		$(HELM_WAIT) \\
		$(HELM_WAIT_FOR_JOBS) \\
		--set global.imageRegistry="$$REGISTRY_URL" \\
		--set global.imageRepository=$(REPOSITORY) \\
		--set global.imageTag=$(IMAGE_TAG) \\
		--set routes.sharedHost="$(PROJECT_NAME)-$(NAMESPACE).$(CLUSTER_DOMAIN)" \\
		$(HELM_SECRET_PARAMS) \\
		$(HELM_EXTRA_ARGS) || (echo ""; echo "❌ Helm deployment failed!"; echo ""; echo "Run 'make debug' for detailed diagnostics or 'make status' for quick status check."; echo ""; $(MAKE) debug; exit 1)

# Deploy in development mode
deploy-dev: create-project ${hasContainerizedPackages ? 'push-images ' : ''}helm-dep-update
	@echo "Deploying application in development mode..."
	@if [ -f "$(ENV_FILE)" ]; then \
		set -a; source $(ENV_FILE); set +a; \
	fi; \
	REGISTRY_URL="$(REGISTRY_URL)"; \
	if [ -z "$$REGISTRY_URL" ]; then \
		REGISTRY_URL=$$(oc get route default-route -n openshift-image-registry -o jsonpath='{.spec.host}' 2>/dev/null || echo ""); \
	fi; \
	if [ -z "$$REGISTRY_URL" ]; then \
		CLUSTER_DOMAIN=$$(oc whoami --show-server 2>/dev/null | sed -E 's|https://api\\.([^:]+).*|apps.\\1|' || echo ""); \
		if [ -n "$$CLUSTER_DOMAIN" ]; then REGISTRY_URL="default-route-openshift-image-registry.$$CLUSTER_DOMAIN"; fi; \
	fi; \
	if echo "$$REGISTRY_URL" | grep -q "\\.svc:"; then \
		REGISTRY_URL=$$(oc get route default-route -n openshift-image-registry -o jsonpath='{.spec.host}' 2>/dev/null || echo "$$REGISTRY_URL"); \
	fi; \
	helm upgrade --install $(PROJECT_NAME) ./deploy/helm/$(PROJECT_NAME) \\
		--namespace $(NAMESPACE) \\
		--timeout $(HELM_TIMEOUT) \\
		$(HELM_WAIT) \\
		$(HELM_WAIT_FOR_JOBS) \\
		--set global.imageRegistry="$$REGISTRY_URL" \\
		--set global.imageRepository=$(REPOSITORY) \\
		--set global.imageTag=$(IMAGE_TAG) \\
		--set routes.sharedHost="$(PROJECT_NAME)-$(NAMESPACE).$(CLUSTER_DOMAIN)" \\
		--set database.persistence.enabled=false \\
		--set api.replicas=1 \\
		--set ui.replicas=1 \\
		$(HELM_SECRET_PARAMS) \\
		$(HELM_EXTRA_ARGS) || (echo ""; echo "❌ Helm deployment failed!"; echo ""; echo "Run 'make debug' for detailed diagnostics or 'make status' for quick status check."; echo ""; $(MAKE) debug; exit 1)

# Show deployment status and diagnostics
status:
	@echo "=== Deployment Status ==="
	@helm status $(PROJECT_NAME) --namespace $(NAMESPACE) 2>/dev/null || echo "Release not found"
	@echo ""
	@echo "=== Pod Status ==="
	@oc get pods -n $(NAMESPACE) 2>/dev/null || kubectl get pods -n $(NAMESPACE) 2>/dev/null || echo "Cannot access pods"
	@echo ""
	@echo "=== Services ==="
	@oc get svc -n $(NAMESPACE) 2>/dev/null || kubectl get svc -n $(NAMESPACE) 2>/dev/null || echo "Cannot access services"
	@echo ""
	${hasDb ? `@echo "=== Migration Job Status ==="
	@oc get jobs -n $(NAMESPACE) -l app.kubernetes.io/component=migration 2>/dev/null || kubectl get jobs -n $(NAMESPACE) -l app.kubernetes.io/component=migration 2>/dev/null || echo "No migration jobs found"
	@echo ""` : ''}
	@echo "=== Recent Events ==="
	@oc get events -n $(NAMESPACE) --sort-by='.lastTimestamp' --tail=20 2>/dev/null || kubectl get events -n $(NAMESPACE) --sort-by='.lastTimestamp' --tail=20 2>/dev/null || echo "Cannot access events"

# Show detailed diagnostics for failed deployments
debug:
	@echo "=== Helm Release Status ==="
	@helm status $(PROJECT_NAME) --namespace $(NAMESPACE) 2>/dev/null || echo "Release not found or not accessible"
	@echo ""
	@echo "=== Pod Status ==="
	@oc get pods -n $(NAMESPACE) 2>/dev/null || kubectl get pods -n $(NAMESPACE) 2>/dev/null || echo "Cannot access pods"
	@echo ""
	@echo "=== Failed/CrashLoopBackOff Pods ==="
	@FAILED_PODS=$$(oc get pods -n $(NAMESPACE) -o name 2>/dev/null | grep -E "(Failed|CrashLoopBackOff|Error|ImagePullBackOff)" || kubectl get pods -n $(NAMESPACE) -o name 2>/dev/null | grep -E "(Failed|CrashLoopBackOff|Error|ImagePullBackOff)" || echo ""); \
	if [ -n "$$FAILED_PODS" ]; then \
		oc get pods -n $(NAMESPACE) -o wide 2>/dev/null | grep -E "(Failed|CrashLoopBackOff|Error|ImagePullBackOff)" || kubectl get pods -n $(NAMESPACE) -o wide 2>/dev/null | grep -E "(Failed|CrashLoopBackOff|Error|ImagePullBackOff)" || true; \
	else \
		echo "No failed pods found"; \
	fi
	@echo ""
	@echo "=== Pod Logs (CrashLoopBackOff pods) ==="
	@for pod_name in $$(oc get pods -n $(NAMESPACE) 2>/dev/null | grep CrashLoopBackOff | awk '{print $$1}' || kubectl get pods -n $(NAMESPACE) 2>/dev/null | grep CrashLoopBackOff | awk '{print $$1}' || echo ""); do \
		if [ -z "$$pod_name" ]; then echo "No CrashLoopBackOff pods found"; break; fi; \
		echo "--- Logs for $$pod_name ---"; \
		oc logs -n $(NAMESPACE) $$pod_name --tail=50 2>/dev/null || kubectl logs -n $(NAMESPACE) $$pod_name --tail=50 2>/dev/null || echo "Cannot access logs for $$pod_name"; \
		echo ""; \
	done
	@echo ""
	@echo "=== Pod Describe (ImagePullBackOff pods) ==="
	@for pod_name in $$(oc get pods -n $(NAMESPACE) 2>/dev/null | grep ImagePullBackOff | awk '{print $$1}' || kubectl get pods -n $(NAMESPACE) 2>/dev/null | grep ImagePullBackOff | awk '{print $$1}' || echo ""); do \
		if [ -z "$$pod_name" ]; then echo "No ImagePullBackOff pods found"; break; fi; \
		echo "--- Describe $$pod_name ---"; \
		oc describe pod -n $(NAMESPACE) $$pod_name 2>/dev/null | tail -40 || kubectl describe pod -n $(NAMESPACE) $$pod_name 2>/dev/null | tail -40 || echo "Cannot describe $$pod_name"; \
		echo ""; \
	done
	@echo ""
	@echo "=== Recent Events ==="
	@oc get events -n $(NAMESPACE) 2>/dev/null | tail -30 || kubectl get events -n $(NAMESPACE) 2>/dev/null | tail -30 || echo "Cannot access events"
	@echo ""
	${hasDb ? `@echo "=== Migration Job Status ==="
	@oc get jobs -n $(NAMESPACE) -l app.kubernetes.io/component=migration 2>/dev/null || kubectl get jobs -n $(NAMESPACE) -l app.kubernetes.io/component=migration 2>/dev/null || echo "No migration jobs found"
	@echo ""
	@echo "=== Migration Job Pod Logs ==="
	@MIGRATION_POD=$$(oc get pods -n $(NAMESPACE) -l app.kubernetes.io/component=migration -o name 2>/dev/null | head -1 || kubectl get pods -n $(NAMESPACE) -l app.kubernetes.io/component=migration -o name 2>/dev/null | head -1); \
	if [ -n "$$MIGRATION_POD" ]; then \
		pod_name=$$(echo $$MIGRATION_POD | sed 's|pod/||'); \
		echo "Migration pod: $$pod_name"; \
		oc logs -n $(NAMESPACE) $$pod_name --tail=100 2>/dev/null || kubectl logs -n $(NAMESPACE) $$pod_name --tail=100 2>/dev/null || echo "Cannot access migration logs"; \
		echo ""; \
		oc describe pod -n $(NAMESPACE) $$pod_name 2>/dev/null | tail -40 || kubectl describe pod -n $(NAMESPACE) $$pod_name 2>/dev/null | tail -40 || echo "Cannot describe migration pod"; \
	else \
		echo "No migration pod found"; \
	fi
	@echo ""` : ''}
	@echo "=== Image Pull Issues ==="
	@oc describe pods -n $(NAMESPACE) 2>/dev/null | grep -B 2 -A 10 -i "imagepull\|errimagepull\|imagepullbackoff" || kubectl describe pods -n $(NAMESPACE) 2>/dev/null | grep -B 2 -A 10 -i "imagepull\|errimagepull\|imagepullbackoff" || echo "No image pull errors detected"
	@echo ""
	@echo "=== Troubleshooting Commands ==="
	@echo "  Check all resources: oc get all -n $(NAMESPACE)"
	@echo "  Check Helm status: helm status $(PROJECT_NAME) -n $(NAMESPACE)"
	@echo "  View pod logs: oc logs -n $(NAMESPACE) <pod-name>"
	@echo "  Describe pod: oc describe pod -n $(NAMESPACE) <pod-name>"
	@echo "  Check events: oc get events -n $(NAMESPACE) --sort-by='.lastTimestamp'"
	${hasDb ? `@echo "  Migration logs: oc logs -n $(NAMESPACE) -l app.kubernetes.io/component=migration"` : ''}

# Undeploy application
undeploy:
	@echo "Undeploying application..."
	@helm uninstall $(PROJECT_NAME) --namespace $(NAMESPACE) || echo "Release $(PROJECT_NAME) not found"
	@echo "Cleaning up migration jobs and pods..."
	@oc delete job -l app.kubernetes.io/component=migration -n $(NAMESPACE) 2>/dev/null || true
	@oc delete pod -l app.kubernetes.io/component=migration -n $(NAMESPACE) 2>/dev/null || true
	@echo "Cleanup complete"

# Lint Helm chart
helm-lint: helm-dep-update
	@echo "Linting Helm chart..."
	@helm lint ./deploy/helm/$(PROJECT_NAME)

# Render Helm templates
helm-template: helm-dep-update
	@echo "Rendering Helm templates..."
	@if [ -f "$(ENV_FILE)" ]; then \\
		set -a; source $(ENV_FILE); set +a; \\
	fi; \\
	helm template $(PROJECT_NAME) ./deploy/helm/$(PROJECT_NAME) \\
		--set global.imageRegistry=$(REGISTRY_URL) \\
		--set global.imageRepository=$(REPOSITORY) \\
		--set global.imageTag=$(IMAGE_TAG) \\
		$(HELM_SECRET_PARAMS)`);

  // PHONY declaration - all targets can be declared together now that we use dashes instead of colons
  const phonyTargets = [
    'help',
    'setup',
    'dev',
    'build',
    'test',
    'lint',
    ...(hasDb ? ['db-start', 'db-stop', 'db-logs', 'db-upgrade'] : []),
    'containers-build',
    'containers-up',
    'containers-down',
    'containers-logs',
    ...(hasContainerizedPackages ? ['build-images', 'push-images'] : []),
    'create-project',
    'helm-dep-update',
    'deploy',
    'deploy-dev',
    'undeploy',
    'status',
    'debug',
    'helm-lint',
    'helm-template',
    'clean',
  ];
  
  const phonyDeclarations = `.PHONY: ${phonyTargets.join(' ')}`;

  return `# Makefile for ${config.name}
# Generated by AI QuickStart CLI

.DEFAULT_GOAL := help

${targets.join('\n\n')}

${phonyDeclarations}
`;
};

