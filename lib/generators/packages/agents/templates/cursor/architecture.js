export const generateCursorArchitecture = (params) => {
    const { config, features } = params;
    const packageStructure = `${config.name}/
├── packages/
${features.ui ? `│   ├── ui/              # React frontend (pnpm)\n` : ''}${features.api ? `│   ├── api/             # FastAPI backend (uv/Python)\n` : ''}${features.db ? `│   ├── db/              # Database models & migrations (uv/Python)\n` : ''}│   └── configs/         # Shared ESLint, Prettier, Ruff configs
├── deploy/helm/         # Helm charts for OpenShift/Kubernetes
├── compose.yml          # Local development with containers
├── turbo.json           # Turborepo pipeline configuration
└── Makefile             # Common development commands`;
    const devUrls = [];
    if (features.ui)
        devUrls.push('- **Frontend**: http://localhost:3000');
    if (features.api) {
        devUrls.push('- **API**: http://localhost:8000');
        devUrls.push('- **API Docs**: http://localhost:8000/docs (Swagger UI)');
    }
    if (features.db)
        devUrls.push('- **Database**: postgresql://localhost:5432');
    return `---
description: "Core architecture and project structure for the ${config.name} monorepo"
alwaysApply: true
---

# Project Architecture

This is a **Turborepo monorepo** for building AI-powered applications${features.ui ? ' with a React frontend' : ''}${features.api ? ', FastAPI backend' : ''}${features.db ? ', and PostgreSQL database' : ''}.

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Build System | Turborepo | Monorepo task orchestration and caching |
${features.ui ? `| Frontend | React 19 + Vite | Modern UI with fast HMR |
| Routing | TanStack Router | Type-safe file-based routing |
| State | TanStack Query | Server state management and caching |
| Styling | Tailwind CSS + shadcn/ui | Utility-first CSS with accessible components |
` : ''}${features.api ? `| Backend | FastAPI | Async Python API with OpenAPI docs |
` : ''}${features.db ? `| Database | PostgreSQL + SQLAlchemy | Async database with ORM |
| Migrations | Alembic | Database schema versioning |
` : ''}

## Package Structure

\`\`\`
${packageStructure}
\`\`\`

## Package Managers

- **Node.js packages** (ui, configs): Use \`pnpm\`
- **Python packages** (api, db): Use \`uv\` (fast Python package manager)
- **Root commands**: Use \`make\` or \`pnpm\` (which delegates to Turbo)

## Key Commands

\`\`\`bash
# Setup
make setup              # Install all dependencies (Node + Python)

# Development
make dev                # Start all dev servers${features.ui ? ' (UI' : ''}${features.api ? ' + API)' : ')'}
${features.db ? `make db-start           # Start PostgreSQL container
make db-migrate         # Run database migrations
` : ''}
# Quality
make lint               # Run linters across all packages
make test               # Run tests across all packages
pnpm type-check         # TypeScript type checking

# Containers
make containers-build   # Build all container images
make containers-up      # Start all services via compose
\`\`\`

## Development URLs

${devUrls.join('\n')}

## Environment Configuration

- \`.env\` - Local development variables (gitignored)
- \`.env.example\` - Template for required environment variables
- Secrets in production managed via Helm values and OpenShift secrets
`;
};
