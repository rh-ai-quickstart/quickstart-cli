import { ConfigTemplateParams } from './index.js';

export const generateRootReadme = (params: ConfigTemplateParams): string => {
  const { config } = params;

  const enabledFeatures = Object.entries(config.features)
    .filter(([_, enabled]) => enabled)
    .map(([featureId, _]) => featureId);

  const hasApi = enabledFeatures.includes('api');
  const hasUi = enabledFeatures.includes('ui');
  const hasDb = enabledFeatures.includes('db');

  return `# ${config.name}

${config.description || 'A full-stack application built with modern tools and best practices.'}

## Architecture

This project is built with:

- **Turborepo** - High-performance build system for the monorepo${
    hasUi ? '\n- **React + Vite** - Modern frontend with TanStack Router' : ''
  }${hasApi ? '\n- **FastAPI** - Python backend with async support' : ''}${
    hasDb ? '\n- **PostgreSQL** - Database with Alembic migrations' : ''
  }

## Project Structure

\`\`\`
${config.name}/
├── packages/
${hasUi ? '│   ├── ui/           # React frontend application' : ''}${
    hasApi ? '\n│   ├── api/          # FastAPI backend service' : ''
  }${hasDb ? '\n│   └── db/           # Database and migrations' : ''}
├── compose.yml       # Docker/Podman Compose configuration (all services)
├── Makefile          # Makefile with common commands
├── turbo.json        # Turborepo configuration
└── package.json      # Root package configuration
\`\`\`

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 9+${hasApi ? '\n- Python 3.11+\n- uv (Python package manager)' : ''}${
    hasDb ? '\n- Podman and podman-compose (for database)' : ''
  }

### Development

1. **Install all dependencies** (Node.js + Python):
\`\`\`bash
make setup
\`\`\`

   Or using pnpm directly:
\`\`\`bash
pnpm setup
\`\`\`

   Or install them separately:
\`\`\`bash
pnpm install          # Install Node.js dependencies
pnpm install:deps     # Install Python dependencies in API package
\`\`\`

${
  hasDb
    ? `2. **Start the database** (using Makefile - recommended):
\`\`\`bash
make db-start
\`\`\`

   Or using pnpm:
\`\`\`bash
pnpm db:start
\`\`\`

3. **Run database migrations**:
\`\`\`bash
make db-upgrade
\`\`\`

   Or using pnpm:
\`\`\`bash
pnpm db:upgrade
\`\`\`

4. **Start development servers**:`
    : '2. **Start development servers**:'
}
\`\`\`bash
make dev
\`\`\`

   Or using pnpm:
\`\`\`bash
pnpm dev
\`\`\`

### Available Commands

**Using Makefile (Recommended)** - Works with any package manager (pnpm/npm/yarn):
\`\`\`bash
make setup            # Install all dependencies
make dev              # Start all development servers
make build            # Build all packages
make test             # Run tests across all packages
make lint             # Check code formatting
${
  hasDb
    ? `make db-start         # Start database container
make db-stop          # Stop database container
make db-logs          # View database logs
make db-upgrade       # Run database migrations
make containers-build # Build all containers
make containers-up    # Start all containers (production-like)
make containers-down  # Stop all containers
`
    : ''
}make clean            # Clean build artifacts
\`\`\`

**Using pnpm directly**:
\`\`\`bash
# Development
pnpm dev              # Start all development servers
pnpm build            # Build all packages
pnpm test             # Run tests across all packages
pnpm lint             # Check code formatting
pnpm format           # Format code

${
  hasDb
    ? `# Database
pnpm db:start         # Start database containers
pnpm db:stop          # Stop database containers  
pnpm db:upgrade       # Run database migrations
pnpm db:revision      # Create new migration
pnpm compose:up       # Start all containers
pnpm compose:down     # Stop all containers
pnpm containers:build # Build all containers
`
    : ''
}# Utilities
pnpm clean            # Clean build artifacts (turbo prune)
\`\`\`

**Note**: The \`compose.yml\` file at the project root manages all containerized services (database, and future API/UI containers). Service names follow the format \`[project-name]-[package]\` (e.g., \`my-chatbot-db\`).

## Development URLs

${hasUi ? '- **Frontend App**: http://localhost:3000' : ''}${
    hasApi
      ? '\n- **API Server**: http://localhost:8000\n- **API Documentation**: http://localhost:8000/docs'
      : ''
  }${hasDb ? '\n- **Database**: postgresql://localhost:5432' : ''}

## Deployment

This project supports multiple deployment strategies for different environments.

### Container-Based Deployment (Docker/Podman Compose)

For local testing or single-server deployments, use Docker/Podman Compose:

\`\`\`bash
# Build all container images
make containers-build

# Start all services
make containers-up

# View logs
make containers-logs

# Stop all services
make containers-down
\`\`\`

**Note**: Before deploying, ensure you've:
1. Built production-ready container images
2. Configured environment variables in \`.env\` or \`compose.yml\`
3. Run database migrations if deploying with a database

### OpenShift/Helm Deployment

For production OpenShift (or Kubernetes) deployments, use the included Helm charts.

#### Prerequisites

- OpenShift cluster (4.10+) or Kubernetes cluster (1.24+)
- \`oc\` CLI configured to access your OpenShift cluster (or \`kubectl\` for Kubernetes)
- \`helm\` CLI installed (v3.8+)
- Container registry access (for pushing images)

#### Building Container Images

Before deploying to OpenShift, build and push your container images:

\`\`\`bash
# Build API image (if API is enabled)
${hasApi ? `cd packages/api
podman build -t ${config.name}-api:latest .
podman tag ${config.name}-api:latest registry.example.com/${config.name}-api:latest
podman push registry.example.com/${config.name}-api:latest` : '# API not enabled'}

# Build UI image (if UI is enabled)
${hasUi ? `cd packages/ui
podman build -t ${config.name}-ui:latest .
podman tag ${config.name}-ui:latest registry.example.com/${config.name}-ui:latest
podman push registry.example.com/${config.name}-ui:latest` : '# UI not enabled'}
\`\`\`

#### Deploying with Helm

**Option 1: Using Makefile (Recommended)**

The easiest way to deploy is using the provided Makefile targets:

1. **Configure environment variables**:

   Create a \`.env\` file in the project root:

   \`\`\`env
   ${hasDb ? `POSTGRES_DB=${config.name}
   POSTGRES_USER=your-db-user
   POSTGRES_PASSWORD=your-secure-password` : ''}${hasApi ? `
   DATABASE_URL=postgresql+asyncpg://user:password@${config.name}-db:5432/${config.name}
   DEBUG=false
   ALLOWED_HOSTS=["*"]` : ''}${hasUi ? `
   VITE_API_BASE_URL=https://api.example.com
   VITE_ENVIRONMENT=production` : ''}
   \`\`\`

2. **Deploy to OpenShift**:

   \`\`\`bash
   # Production deployment
   make deploy
   
   # Development deployment (single replica, no persistence)
   make deploy-dev
   
   # Customize deployment
   make deploy REGISTRY_URL=quay.io REPOSITORY=myorg IMAGE_TAG=v1.0.0
   \`\`\`

   **Note**: The Makefile automatically creates an OpenShift project if it doesn't exist. For Kubernetes, use \`--namespace\` instead of \`--project\` in Helm commands.

**Option 2: Using Helm CLI Directly**

For more control, use Helm CLI directly:

1. **Configure environment variables**:

   Export environment variables or create a \`.env\` file:

   \`\`\`bash
   ${hasDb ? `export POSTGRES_DB="${config.name}"
   export POSTGRES_USER="your-db-user"
   export POSTGRES_PASSWORD="your-secure-password"` : ''}${hasApi ? `
   export DATABASE_URL="postgresql+asyncpg://user:password@${config.name}-db:5432/${config.name}"
   export DEBUG="false"
   export ALLOWED_HOSTS='["*"]'` : ''}${hasUi ? `
   export VITE_API_BASE_URL="https://api.example.com"
   export VITE_ENVIRONMENT="production"` : ''}
   \`\`\`

2. **Install the Helm chart**:

   **For OpenShift** (recommended):
   \`\`\`bash
   cd deploy/helm/${config.name}
   
   # Create OpenShift project first
   oc new-project ${config.name} || oc project ${config.name}
   
   # Install with default values
   helm install ${config.name} . \\
     --namespace ${config.name}${hasDb ? ` \\
     --set secrets.POSTGRES_DB="$POSTGRES_DB" \\
     --set secrets.POSTGRES_USER="$POSTGRES_USER" \\
     --set secrets.POSTGRES_PASSWORD="$POSTGRES_PASSWORD"` : ''}${hasApi ? ` \\
     --set secrets.DATABASE_URL="$DATABASE_URL" \\
     --set secrets.DEBUG="$DEBUG" \\
     --set secrets.ALLOWED_HOSTS="$ALLOWED_HOSTS"` : ''}${hasUi ? ` \\
     --set secrets.VITE_API_BASE_URL="$VITE_API_BASE_URL"` : ''}
   \`\`\`

   **For Kubernetes** (alternative):
   \`\`\`bash
   cd deploy/helm/${config.name}
   
   # Install with default values
   helm install ${config.name} . \\
     --namespace ${config.name} \\
     --create-namespace${hasDb ? ` \\
     --set secrets.POSTGRES_DB="$POSTGRES_DB" \\
     --set secrets.POSTGRES_USER="$POSTGRES_USER" \\
     --set secrets.POSTGRES_PASSWORD="$POSTGRES_PASSWORD"` : ''}${hasApi ? ` \\
     --set secrets.DATABASE_URL="$DATABASE_URL" \\
     --set secrets.DEBUG="$DEBUG" \\
     --set secrets.ALLOWED_HOSTS="$ALLOWED_HOSTS"` : ''}${hasUi ? ` \\
     --set secrets.VITE_API_BASE_URL="$VITE_API_BASE_URL"` : ''}
   \`\`\`

3. **Update image references** (if using custom registry):

   Using Makefile:
   \`\`\`bash
   make deploy REGISTRY_URL=registry.example.com REPOSITORY=myorg IMAGE_TAG=v1.0.0
   \`\`\`

   Or edit \`deploy/helm/${config.name}/values.yaml\` directly:

   Edit \`deploy/helm/${config.name}/values.yaml\` and update image repository/tag:

   \`\`\`yaml
   ${hasApi ? `api:
     image:
       repository: registry.example.com/${config.name}-api
       tag: latest` : ''}${hasUi ? `
   ui:
     image:
       repository: registry.example.com/${config.name}-ui
       tag: latest` : ''}
   \`\`\`

4. **Run database migrations** (if database is enabled):

   \`\`\`bash
   ${hasDb ? `# Migrations run automatically via an OpenShift/Kubernetes Job on first deployment
   # To manually trigger migrations (OpenShift):
   oc create job --from=cronjob/${config.name}-migration ${config.name}-migration-manual -n ${config.name}
   
   # Or using kubectl (Kubernetes):
   kubectl create job --from=cronjob/${config.name}-migration ${config.name}-migration-manual -n ${config.name}` : '# Database not enabled'}
   \`\`\`

5. **Verify deployment**:

   **Using OpenShift CLI** (\`oc\`):
   \`\`\`bash
   # Check pod status
   oc get pods -n ${config.name}
   
   # Check services
   oc get svc -n ${config.name}
   
   # Check routes (OpenShift)
   oc get routes -n ${config.name}
   
   # View logs
   ${hasApi ? `oc logs -n ${config.name} -l app=${config.name}-api` : ''}${hasUi ? `
   oc logs -n ${config.name} -l app=${config.name}-ui` : ''}${hasDb ? `
   oc logs -n ${config.name} -l app=${config.name}-db` : ''}
   \`\`\`

   **Using Kubernetes CLI** (\`kubectl\` - alternative):
   \`\`\`bash
   # Check pod status
   kubectl get pods -n ${config.name}
   
   # Check services
   kubectl get svc -n ${config.name}
   
   # View logs
   ${hasApi ? `kubectl logs -n ${config.name} -l app=${config.name}-api` : ''}${hasUi ? `
   kubectl logs -n ${config.name} -l app=${config.name}-ui` : ''}${hasDb ? `
   kubectl logs -n ${config.name} -l app=${config.name}-db` : ''}
   \`\`\`

#### Upgrading a Deployment

Using Makefile:
\`\`\`bash
# Upgrade with new image tag
make deploy IMAGE_TAG=v1.1.0

# Upgrade with custom values
make deploy HELM_EXTRA_ARGS="--set api.replicas=3"
\`\`\`

Using Helm CLI:
\`\`\`bash
cd deploy/helm/${config.name}

# Upgrade with new values
helm upgrade ${config.name} . \\
  --namespace ${config.name} \\
  --reuse-values \\
  --set api.image.tag=v1.1.0
\`\`\`

#### Uninstalling

Using Makefile:
\`\`\`bash
make undeploy
\`\`\`

Using OpenShift CLI (\`oc\`):
\`\`\`bash
helm uninstall ${config.name} --namespace ${config.name}
oc delete project ${config.name}
\`\`\`

Using Kubernetes CLI (\`kubectl\` - alternative):
\`\`\`bash
helm uninstall ${config.name} --namespace ${config.name}
kubectl delete namespace ${config.name}
\`\`\`

### Environment Configuration

#### Development

Create a \`.env\` file in the project root for local development:

\`\`\`env
${hasDb ? `# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/${config.name}
DB_ECHO=false` : ''}${hasApi ? `
# API
DEBUG=true
ALLOWED_HOSTS=["http://localhost:5173"]` : ''}${hasUi ? `
# UI
VITE_API_BASE_URL=http://localhost:8000
VITE_ENVIRONMENT=development` : ''}
\`\`\`

#### Production

For production deployments:

1. **Use OpenShift Secrets** (recommended):
   - Secrets are managed via Helm values.yaml
   - Never commit secrets to version control
   - OpenShift provides additional security features like secret rotation

2. **Use environment-specific values files**:
   \`\`\`bash
   # Create production values
   cp deploy/helm/${config.name}/values.yaml deploy/helm/${config.name}/values.prod.yaml
   
   # Deploy with production values
   helm install ${config.name} . -f values.prod.yaml
   \`\`\`

3. **Configure resource limits**:
   Edit \`deploy/helm/${config.name}/values.yaml\` to adjust CPU/memory limits based on your workload.

### Production Considerations

- **Database Backups**: Set up regular backups for PostgreSQL if database is enabled
- **Monitoring**: Configure health checks and monitoring for all services
- **Scaling**: Adjust replica counts in Helm values.yaml based on load
- **Security**: 
  - Use strong passwords and API keys
  - Enable TLS/HTTPS for production
  - Configure network policies
  - Review security contexts in Helm templates
- **High Availability**: Consider multi-replica deployments for critical services
- **Resource Management**: Set appropriate CPU/memory limits based on your workload

### Troubleshooting

**Pods not starting**:

Using OpenShift CLI (\`oc\`):
\`\`\`bash
oc describe pod <pod-name> -n ${config.name}
oc logs <pod-name> -n ${config.name}
oc get events -n ${config.name} --sort-by='.lastTimestamp'
\`\`\`

Using Kubernetes CLI (\`kubectl\` - alternative):
\`\`\`bash
kubectl describe pod <pod-name> -n ${config.name}
kubectl logs <pod-name> -n ${config.name}
kubectl get events -n ${config.name} --sort-by='.lastTimestamp'
\`\`\`

**Database connection issues**:
- Verify database service is running: \`oc get svc -n ${config.name}\` (or \`kubectl get svc -n ${config.name}\`)
- Check DATABASE_URL format matches your database configuration
- Verify secrets are correctly set: \`oc get secret -n ${config.name}\` (or \`kubectl get secret -n ${config.name}\`)

**Image pull errors**:
- Verify image registry credentials
- Check image pull policy in values.yaml
- Ensure images are pushed to the registry

For more details, see the [Helm chart documentation](deploy/helm/${config.name}/README.md) (if available) or the [Helm values file](deploy/helm/${config.name}/values.yaml).

## Learn More

- [Turborepo](https://turbo.build/) - Monorepo build system${
    hasUi ? '\n- [TanStack Router](https://tanstack.com/router) - Type-safe routing' : ''
  }${hasApi ? '\n- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework' : ''}${
    hasDb ? '\n- [Alembic](https://alembic.sqlalchemy.org/) - Database migrations' : ''
  }

---

Generated with [AI QuickStart CLI](https://github.com/TheiaSurette/quickstart-cli)
`;
};
