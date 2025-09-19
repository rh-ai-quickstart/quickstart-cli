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
├── turbo.json        # Turborepo configuration
└── package.json      # Root package configuration
\`\`\`

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 9+${hasApi ? '\n- Python 3.11+\n- uv (Python package manager)' : ''}${
    hasDb ? '\n- Docker (for database)' : ''
  }

### Development

1. **Install all dependencies** (Node.js + Python):
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
    ? `2. **Start the database**:
\`\`\`bash
pnpm db:start
\`\`\`

3. **Run database migrations**:
\`\`\`bash
pnpm db:upgrade
\`\`\`

4. **Start development servers**:`
    : '2. **Start development servers**:'
}
\`\`\`bash
pnpm dev
\`\`\`

### Available Commands

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
`
    : ''
}# Utilities
pnpm clean            # Clean build artifacts (turbo prune)
\`\`\`

## Development URLs

${hasUi ? '- **Frontend App**: http://localhost:3000' : ''}${
    hasApi
      ? '\n- **API Server**: http://localhost:8000\n- **API Documentation**: http://localhost:8000/docs'
      : ''
  }${hasDb ? '\n- **Database**: postgresql://localhost:5432' : ''}

## Learn More

- [Turborepo](https://turbo.build/) - Monorepo build system${
    hasUi ? '\n- [TanStack Router](https://tanstack.com/router) - Type-safe routing' : ''
  }${hasApi ? '\n- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework' : ''}${
    hasDb ? '\n- [Alembic](https://alembic.sqlalchemy.org/) - Database migrations' : ''
  }

---

Generated with [AI Kickstart CLI](https://github.com/your-org/ai-kickstart)
`;
};
