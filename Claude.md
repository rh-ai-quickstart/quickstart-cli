# Project: AI QuickStart CLI

CLI tool for generating production-ready, AI-powered full-stack applications.

---

## Tech Stack

- **CLI:** TypeScript, Ink (React for CLIs), Zod
- **Generated Frontend:** React 19, Vite, TanStack Router/Query, Tailwind CSS
- **Generated Backend:** Python, FastAPI, Pydantic v2, SQLAlchemy 2.0
- **Testing:** Vitest (CLI), pytest (Python)

---

## Key Conventions

- Use TypeScript template functions (not external template engines)
- Use `fs.outputFile` for atomic file creation
- Use `path.join` for cross-platform compatibility
- Follow three-layer testing: unit → integration → E2E

---

## File Structure

- `src/generators/packages/` — Modular package generators
- `src/components/` — Ink React UI components
- `src/__tests__/` — Test files organized by type

---

## Additional Documentation

Use the following documents when working with particular types of files or changes.

| Rule File | Purpose |
|-----------|---------|
| [CLI Architecture](.cursor/rules/cli-architecture.mdc) | Complete architecture guide for the CLI monorepo, covering project organization, core principles, async generator flow, testing tiers, and file operation standards |
| [CLI Development](.cursor/rules/cli-development.mdc) | CLI-specific development conventions: Ink UI patterns, modular generator structure, CLI argument support (with Zod validation), error handling, and progress reporting |
| [Helm Kubernetes](.cursor/rules/helm-kubernetes.mdc) | Best practices for managing and customizing Helm charts for generated projects, including naming conventions, values.yaml organization, and deployment recipes |
| [Project Standards](.cursor/rules/project-standards.mdc) | Foundational standards for code clarity, documentation, repository hygiene, security, version control, and release process |
| [Python FastAPI](.cursor/rules/python-fastapi.mdc) | Conventions for structuring FastAPI code, creating endpoints, using Pydantic schemas, dependency management, and integrating async database code |
| [React TanStack](.cursor/rules/react-tanstack.mdc) | UI/frontend code structure and conventions: Vite, React 19, TanStack Router for file-based routes, TanStack Query for data fetching, Tailwind CSS, and Storybook |
| [Template Generation](.cursor/rules/template-generation.mdc) | Template authoring guide: type-safe template functions, conditional generation via JS/TS, and atomic file creation using fs-extra |
| [Testing Standards](.cursor/rules/testing-standards.mdc) | Testing strategy for the CLI and generated code: unit test layout, integration/E2E conventions, required CI coverage, and test utility implementations |
| [TypeScript Standards](.cursor/rules/typescript-standards.mdc) | TypeScript code style and strictness for both the CLI and generated UI/packages: naming, immutability, validation strategies, and error typing |
