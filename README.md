# AI Kickstart CLI

Generate production-ready, AI-powered full-stack applications with TypeScript, Python (FastAPI), and React.

## Packages
Core package is always included. Select additional packages (UI, API, DB) in the interactive setup, or use flags: `--ui-only`, `--api-only`, `--db-only`, `--all-features`.

- **Core**: Monorepo foundation (root `package.json`, `turbo.json`, `pnpm-workspace.yaml`, `.gitignore`, `README`); developer tooling (commitlint, Husky pre-commit/commit-msg, `.releaserc`); `.github/pull_request_template.md`. Generators and CLI tests live in this CLI, not the generated project.
- **UI**: React 18 + Vite, TanStack Router/Query, Tailwind CSS, reusable components, Storybook, Vitest + Testing Library
- **API**: FastAPI, Pydantic v2, OpenAPI, pytest, httpx, Ruff/MyPy, Uvicorn; optional SQLAlchemy 2.0 (async) and Alembic when DB is enabled
- **DB**: PostgreSQL, SQLAlchemy, Alembic migrations, Docker Compose, environment-based config

## Quick start

```bash
# Install globally
npm install -g @ai-kickstarts/create-app

# Create a new project
rh-ai-kickstart create my-app

# With specific features
rh-ai-kickstart create my-app --api-only
rh-ai-kickstart create my-app --ui-only
rh-ai-kickstart create my-app --all-features
```

## Usage

```bash
# Interactive (default)
rh-ai-kickstart create my-project

# Non-interactive examples
rh-ai-kickstart create my-api --api-only
rh-ai-kickstart create my-ui --ui-only
rh-ai-kickstart create my-fullstack --all-features

# Custom output directory
rh-ai-kickstart create my-app --output-dir ~/projects
```

## Generated project structure

```
my-project/
├── packages/
│   ├── ui/      # React + Vite
│   ├── api/     # FastAPI
│   └── db/      # Database + Alembic
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## Development

### Prerequisites

- Node.js 18+
- Python 3.11+
- pnpm 8+

### Setup

```bash
git clone <repo-url>
cd boilerplate
pnpm install

# Dev workflow
pnpm dev
pnpm build
pnpm test
```

### Generated project

```bash
cd my-project
pnpm install

# Dev servers
pnpm dev       # all
pnpm dev:ui    # frontend
pnpm dev:api   # backend
pnpm dev:db    # database

# Build, test, lint, format
pnpm build
pnpm test
pnpm lint
pnpm format
```

## Commands

| Command | Description | Example |
|---------|-------------|---------|
| `create` | Generate a new project | `rh-ai-kickstart create my-app` |
| `add-package` | Add a package to an existing project | `rh-ai-kickstart add-package auth` |
| `remove-package` | Remove a package | `rh-ai-kickstart remove-package auth` |

### Global flags

| Flag | Description |
|------|-------------|
| `--help` | Show help |
| `--version` | Show version |

### Create command flags

| Flag | Description | Default |
|------|-------------|---------|
| `--skip-prompts` | Skip interactive prompts | `false` |
| `--output-dir` | Output directory | Current directory |
| `--api-only` | Generate API package only | `false` |
| `--ui-only` | Generate UI package only | `false` |
| `--db-only` | Generate DB package only | `false` |
| `--all-features` | Generate all packages | `false` |

## Testing

```bash
pnpm test            # unit
pnpm test:integration
pnpm test:all
```

## Architecture overview

- **Template system**: TypeScript template functions, modular generators (UI, API, DB), feature-based customization
- **Testing strategy**: unit → integration → end-to-end using real Python/Node toolchains
- **Generation flow**: input → validation → template selection → file generation → dependency install → git init

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).

## Links

- Documentation: [docs/](./docs/)
- Examples: [examples/](./examples/)
- Issues: [GitHub Issues](https://github.com/your-org/repo/issues)
- Discussions: [GitHub Discussions](https://github.com/your-org/repo/discussions)