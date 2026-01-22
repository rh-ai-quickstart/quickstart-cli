# AI Rules Guide

Rules provide context and guidelines to AI agents, helping them understand your project's architecture, coding standards, and conventions. This document covers how to create and manage rules for both Claude Code and Cursor.

---

# What Are Rules?

Rules are prompts automatically included in the AI's context when you interact with it. They help the agent:

- Understand your project structure and architecture
- Follow your coding standards and conventions
- Use the correct patterns and libraries
- Avoid common mistakes specific to your codebase

**Key consideration:** Rules consume context window space, so keep them concise, actionable, and avoid duplicating information that exists elsewhere (like your README).

---

# Claude Code

Claude Code uses a single `CLAUDE.md` file at the repository root for rules.

## Setup

Create a `CLAUDE.md` file in your project root:

```markdown
# Project: My Project Name

## Overview
Brief description of what this project does.

## Tech Stack
- Language/framework details
- Key libraries and their purposes

## Key Conventions
- Important patterns to follow
- Things to avoid

## File Structure
- Where different types of code live
- How the project is organized
```

## Example for This Project

```markdown
# Project: AI QuickStart CLI

## Overview
CLI tool for generating production-ready, AI-powered full-stack applications.

## Tech Stack
- CLI: TypeScript, Ink (React for CLIs), Zod
- Generated Frontend: React 19, Vite, TanStack Router/Query, Tailwind CSS
- Generated Backend: Python, FastAPI, Pydantic v2, SQLAlchemy 2.0
- Testing: Vitest (CLI), pytest (Python)

## Key Conventions
- Use TypeScript template functions (not external template engines)
- Use fs.outputFile for atomic file creation
- Use path.join for cross-platform compatibility
- Follow three-layer testing: unit → integration → E2E

## File Structure
- src/generators/packages/ - Modular package generators
- src/components/ - Ink React UI components
- src/__tests__/ - Test files organized by type
```

## Referencing Other Files

For larger projects, reference additional documentation:

```markdown
# CLAUDE.md

See also:
- docs/architecture.md for system design
- docs/testing.md for testing standards
```

## Best Practices

1. **Keep it concise** — Focus on what's unique to your project
2. **Be specific** — Include actual patterns, not vague guidelines
3. **Update regularly** — Keep rules in sync with your codebase
4. **Avoid duplication** — Don't repeat README content

---

# Cursor

Cursor uses `.mdc` files (Markdown with frontmatter) stored in `.cursor/rules/`. This allows for multiple rule files with conditional application based on file patterns.

## File Location

```
.cursor/
└── rules/
    ├── architecture.mdc      # Core project architecture
    ├── typescript.mdc        # TypeScript conventions
    ├── python.mdc            # Python conventions
    └── testing.mdc           # Testing standards
```

## File Structure

Each `.mdc` file has YAML frontmatter followed by markdown content:

```markdown
---
description: Brief description shown in rule listings
globs: ["**/*.ts", "**/*.tsx"]
alwaysApply: false
---

# Rule Title

## Section 1
Your rule content here...
```

## Frontmatter Options

| Property | Type | Description |
|----------|------|-------------|
| `description` | string | Brief description of what this rule covers |
| `globs` | string[] | File patterns that trigger this rule |
| `alwaysApply` | boolean | If `true`, rule is always included regardless of globs |

### Understanding `alwaysApply` vs `globs`

- **`alwaysApply: true`** — Rule is included in every conversation, regardless of which files are open
- **`alwaysApply: false`** — Rule is only included when you're working with files matching the glob patterns

Example scenarios:
- Core architecture rules → `alwaysApply: true` (always relevant)
- Python-specific rules → `alwaysApply: false`, `globs: ["**/*.py"]` (only when editing Python)

## Creating Rules

### Always-Applied Rule

For project-wide standards that should always be available:

```markdown
---
description: Core project architecture and patterns
globs: []
alwaysApply: true
---

# Project Architecture

## Overview
This is a CLI tool for generating full-stack applications.

## Key Patterns
- Use TypeScript template functions for code generation
- Use async generators for progress reporting
- Follow the three-layer testing pyramid
```

### Conditional Rule

For language or context-specific standards:

```markdown
---
description: Python FastAPI conventions
globs: ["**/*.py", "**/pyproject.toml"]
alwaysApply: false
---

# Python Standards

## FastAPI Patterns
- Use dependency injection for database sessions
- Use Pydantic models for request/response validation
- Use async/await for database operations
```

## Managing Rules

### When to Create Separate Rules

- **Different languages** — Python vs TypeScript vs YAML
- **Different contexts** — Testing vs production code vs infrastructure
- **Different complexity** — Keep each file focused and readable

### When to Use `alwaysApply`

Use sparingly for:
- Core architecture that affects all decisions
- Project-wide conventions (naming, file organization)
- Critical patterns that should never be forgotten

### Glob Pattern Examples

| Pattern | Matches |
|---------|---------|
| `**/*.ts` | All TypeScript files |
| `**/*.py` | All Python files |
| `src/**/*` | Everything in src directory |
| `**/*.test.ts` | All TypeScript test files |
| `**/helm/**/*` | Everything in any helm directory |

---

# This Project's Rules

## Cursor Rules (`.cursor/rules/`)

| Rule File | Always Apply | Globs | Purpose |
|-----------|:------------:|-------|---------|
| `cli-architecture.mdc` | Yes | `src/**/*.ts`, `**/*.test.ts`, `docs/**/*.md` | Core architecture and patterns |
| `project-standards.mdc` | Yes | — | General coding standards |
| `cli-development.mdc` | No | `src/**/*.ts`, `*.ts` | Ink CLI development |
| `typescript-standards.mdc` | No | `**/*.ts`, `**/*.tsx` | TypeScript conventions |
| `python-fastapi.mdc` | No | `**/*.py`, `**/pyproject.toml` | Python/FastAPI patterns |
| `react-tanstack.mdc` | No | `**/*.tsx`, `**/*.ts`, `**/vite.config.*` | React and TanStack patterns |
| `testing-standards.mdc` | No | `**/*.test.ts`, `**/*.spec.ts` | Testing pyramid and patterns |
| `template-generation.mdc` | No | `src/generators/**/*`, `**/templates/*.ts` | Template function standards |
| `helm-kubernetes.mdc` | No | `**/helm/**/*`, `**/*.yaml` | Kubernetes deployment |

---

# Quick Reference

| Feature | Claude Code | Cursor |
|---------|-------------|--------|
| Rule location | `CLAUDE.md` at repo root | `.cursor/rules/*.mdc` |
| Multiple rule files | No (single file) | Yes |
| Conditional rules | Manual references | Glob patterns in frontmatter |
| Always-on rules | Entire file | `alwaysApply: true` |
