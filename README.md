# AI QuickStart CLI

Generate production-ready, AI-powered full-stack applications with TypeScript, Python (FastAPI), and React.

## Packages
Core package is always included. Select additional packages (UI, API, DB) in the interactive setup, or use the `--packages` flag to specify packages: `api`, `ui`, `db`.

- **Core**: Monorepo foundation (root `package.json`, `turbo.json`, `pnpm-workspace.yaml`, `.gitignore`, `README`); developer tooling (commitlint, Husky pre-commit/commit-msg, `.releaserc`); `.github/pull_request_template.md`. Generators and CLI tests live in this CLI, not the generated project.
- **UI**: React 19 + Vite, TanStack Router/Query, Tailwind CSS, reusable components, Storybook, Vitest + Testing Library
- **API**: FastAPI, Pydantic v2, OpenAPI, pytest, httpx, Ruff/MyPy, Uvicorn; optional SQLAlchemy 2.0 (async) and Alembic when DB is enabled
- **DB**: PostgreSQL, SQLAlchemy, Alembic migrations, Docker Compose, environment-based config

## Quick start

```bash
# Install globally
npm install -g @rh-ai-quickstart/cli

# Create a new project (interactive)
quickstart create my-app

# With specific packages
quickstart create my-app --packages api,ui
quickstart create my-app -p api,ui,db
quickstart create my-app -p ui -d "My frontend app"
```

## Usage

```bash
# Interactive (default)
quickstart create my-project

# Non-interactive examples
quickstart create my-api --packages api
quickstart create my-ui --packages ui
quickstart create my-fullstack --packages api,ui,db

# Custom output directory
quickstart create my-app --output-dir ~/projects

# Skip dependency installation
quickstart create my-app --skip-dependencies
quickstart create my-app -s

# With description
quickstart create my-app -p api,ui -d "My full-stack application"
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
cd quickstart-cli
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
| `create` | Generate a new project | `quickstart create my-app` |

### Global flags

| Flag | Description |
|------|-------------|
| `--help` | Show help |
| `--version` | Show version |

### Create command options

| Option | Short | Description | Default |
|------|-------|-------------|---------|
| `--skip-dependencies` | `-s` | Skip installing dependencies after generation | `false` |
| `--output-dir` | `-o` | Output directory for the project | Current directory |
| `--packages` | `-p` | Comma-separated list of packages: `api`, `ui`, `db` (spaces after commas allowed) | Interactive selection |
| `--description` | `-d` | Project description | Interactive input |

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
- Issues: [GitHub Issues](https://github.com/TheiaSurette/quickstart-cli/issues)
- Discussions: [GitHub Discussions](https://github.com/TheiaSurette/quickstart-cli/discussions)