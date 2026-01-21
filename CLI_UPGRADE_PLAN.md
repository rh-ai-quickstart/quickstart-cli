# CLI Upgrade Plan: Syncing quickstart-cli with ai-quickstart-template

This document outlines all changes needed to upgrade the `quickstart-cli` tool to generate projects identical to the improved `ai-quickstart-template`.

## Overview

The improved template includes:
- AI agent configuration files (Claude Code & Cursor)
- Enhanced test infrastructure with fixtures and helpers
- Better documentation with extension guides
- Modern Python tooling (uv instead of pip)
- Stricter linting configuration
- Improved script naming conventions

---

## 1. NEW GENERATOR: AI Agent Rules

### Location
Create new generator: `src/generators/packages/agents/`

### Files to Generate

#### `.claude/rules/` (7 files)
| File | Description |
|------|-------------|
| `architecture.md` | Project architecture overview, tech stack, key commands |
| `ui.md` | React/Vite patterns, TanStack Router/Query, component structure |
| `api.md` | FastAPI patterns, endpoint creation, Pydantic schemas |
| `database.md` | SQLAlchemy models, Alembic migrations |
| `testing.md` | Vitest (UI) and Pytest (API) patterns |
| `code-style.md` | TypeScript and Python conventions |
| `git.md` | Conventional commits, PR workflow |

#### `.cursor/rules/` (7 files)
| File | Description |
|------|-------------|
| `architecture.mdc` | Always-applied project overview (with frontmatter) |
| `ui-development.mdc` | Path-scoped to `packages/ui/**/*` |
| `api-development.mdc` | Path-scoped to `packages/api/**/*.py` |
| `database.mdc` | Path-scoped to `packages/db/**/*.py` |
| `testing.mdc` | Path-scoped to test files |
| `code-style.md` | Always-applied style conventions |
| `git-workflow.md` | Always-applied git conventions |

### Implementation

```typescript
// src/generators/packages/agents/generator.ts
export class AgentRulesGenerator {
  async generate(projectPath: string, config: ProjectConfig): Promise<void> {
    // Generate .claude/rules/*.md files
    // Generate .cursor/rules/*.mdc files
    // Use project name for template substitution
  }
}
```

### Template Variables
All rule files need these substitutions:
- `{{projectName}}` - The project name
- `{{hasUI}}` - Boolean for UI package presence
- `{{hasAPI}}` - Boolean for API package presence
- `{{hasDB}}` - Boolean for DB package presence

---

## 2. UPDATE: UI Package Generator

### Location
`src/generators/packages/ui/`

### Changes Required

#### A. Add Vitest Configuration
**New file:** `packages/ui/vitest.config.ts`

```typescript
// templates/config/vitest-config.ts
export const generateVitestConfig = (): string => `
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
`;
```

#### B. Add Test Utilities Directory
**New files:**
- `packages/ui/src/test/setup.ts`
- `packages/ui/src/test/test-utils.tsx`

```typescript
// templates/test/setup.ts
export const generateTestSetup = (): string => `
import '@testing-library/jest-dom/vitest';
`;

// templates/test/test-utils.tsx
export const generateTestUtils = (config: ProjectConfig): string => `
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement, ReactNode } from 'react';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

interface WrapperProps {
  children: ReactNode;
}

function AllProviders({ children }: WrapperProps) {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from '@testing-library/react';
export { renderWithProviders };
`;
```

#### C. Update package.json Template
**File:** `templates/config/package-json.ts`

**Change:**
```diff
- "lint": "eslint . --ext ts,tsx --report-unused-disable-directives",
+ "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
```

#### D. Enhanced ServiceCard Component
**File:** `templates/components/service-card.ts`

The template version significantly enhances the ServiceCard with developer-focused information:

**Add `PACKAGE_INFO` constant:**
```typescript
const PACKAGE_INFO: Record<string, {
  path: string;
  devUrl: string;
  quickActions: { label: string; url: string; external?: boolean }[];
  commands: { label: string; cmd: string }[];
  gettingStarted: string[];
}> = {
  UI: {
    path: "packages/ui/",
    devUrl: "http://localhost:3000",
    quickActions: [
      { label: "Storybook", url: "http://localhost:6006", external: true },
    ],
    commands: [
      { label: "Dev", cmd: "pnpm dev" },
      { label: "Build", cmd: "pnpm build" },
      { label: "Test", cmd: "pnpm test" },
      // ... more commands
    ],
    gettingStarted: [
      "Create route in \`src/routes/\`",
      "Add components in \`src/components/\`",
      // ... more steps
    ],
  },
  API: { /* similar structure */ },
  Database: { /* similar structure */ },
};
```

**Add `DevInfo` component:**
```typescript
function DevInfo({ serviceName }: { serviceName: string }) {
  // Renders quick action links, command reference, and getting started steps
  // Collapsible "Getting Started" section
  // Package path and dev URL footer
}
```

**Add `formatWithCode` helper:**
```typescript
function formatWithCode(text: string) {
  // Parses backtick-wrapped text into styled <code> elements
}
```

**Update ServiceCard to include DevInfo:**
```diff
  return (
    <div className="group relative...">
      {/* existing card content */}
+     <DevInfo serviceName={service.name} />
    </div>
  );
```

#### E. Simplified StatusPanel Component
**File:** `templates/components/status-panel.ts`

**Changes:**
- Remove Card wrapper, use plain div
- Remove `isLoading` prop
- Change title from "Service Health" to "Services"
- Change description to "Explore each package to get started"
- Remove healthy count display

```diff
- export function StatusPanel({ services, isLoading }: { services: Service[]; isLoading: boolean }) {
+ export function StatusPanel({ services }: { services: Service[] }) {
```

#### F. Remove QuickStats Component
**Action:** Do NOT generate `packages/ui/src/components/quick-stats/` directory

The template removes this component entirely. The functionality is replaced by the enhanced ServiceCard DevInfo.

#### G. Update routes/index.tsx
**File:** `templates/routes/index.ts`

**Changes:**
- Remove QuickStats import and usage
- Remove isLoading from useHealth destructuring
- Add Service type import from schemas
- Add eslint-disable comment for route type workaround
- Add type annotation to find callbacks: `(s: Service) =>`

```diff
- import { QuickStats } from '../components/quick-stats/quick-stats';
+ import type { Service } from '../schemas/health';

- const { data: healthData, isLoading } = useHealth();
+ const { data: healthData } = useHealth();

- status: healthData?.find(s => s.name === 'UI')?.status || 'unknown',
+ status: healthData?.find((s: Service) => s.name === 'UI')?.status || 'unknown',

  <Hero />
- <QuickStats services={services} />
  <div className="mt-6">
-   <StatusPanel services={services} isLoading={isLoading} />
+   <StatusPanel services={services} />
  </div>
```

#### H. Add Hero Component Test
**New file:** `packages/ui/src/components/hero/hero.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './hero';

describe('Hero', () => {
  it('renders the welcome message', () => {
    render(<Hero />);
    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
  });

  it('renders the template name', () => {
    render(<Hero />);
    expect(screen.getByText(/{{projectName}}/i)).toBeInTheDocument();
  });
});
```

#### I. Update Health Schema Type Export
**File:** `templates/schemas/health.ts`

```diff
- export type HealthSchema = z.infer<typeof HealthSchema>;
+ export type Health = z.infer<typeof HealthSchema>;
```

---

## 3. UPDATE: API Package Generator

### Location
`src/generators/packages/api/`

### Changes Required

#### A. Add Test Fixtures
**New file:** `packages/api/tests/conftest.py`

```python
# templates/tests/conftest.py
export const generateConftest = (): string => `
"""
Pytest configuration and fixtures
"""

import pytest
from fastapi.testclient import TestClient

from src.main import app


@pytest.fixture
def client():
    """FastAPI test client fixture"""
    return TestClient(app)


@pytest.fixture
def health_response(client):
    """Get health check response data"""
    response = client.get("/health/")
    assert response.status_code == 200
    return response.json()
`;
```

#### B. Add Test Helpers
**New file:** `packages/api/tests/helpers.py`

```python
# templates/tests/helpers.py
export const generateTestHelpers = (): string => `
"""
Test helper functions
"""


def find_service(services: list, name: str) -> dict | None:
    """Find a service by name in health check response.

    Args:
        services: List of service dicts from health endpoint
        name: Service name to find (e.g., "API", "Database")

    Returns:
        Service dict if found, None otherwise
    """
    return next((s for s in services if s["name"] == name), None)


def assert_service_exists(services: list, name: str) -> dict:
    """Assert a service exists and return it.

    Args:
        services: List of service dicts from health endpoint
        name: Service name to find

    Returns:
        Service dict

    Raises:
        AssertionError: If service not found
    """
    service = find_service(services, name)
    assert service is not None, f"Service '{name}' not found in response"
    return service
`;
```

#### C. Update test_health.py Template
**File:** `templates/tests/test-health.py`

Replace with fixture-based version:
```python
"""
Health endpoint tests
"""

from helpers import assert_service_exists


def test_health_check_endpoint_exists(health_response):
    """Test health check endpoint returns list of services"""
    assert isinstance(health_response, list)
    assert len(health_response) >= 1


def test_health_check_includes_database(health_response):
    """Test health check includes database status"""
    db_service = assert_service_exists(health_response, "Database")
    assert db_service["status"] in ["healthy", "down"]
    assert "message" in db_service
    assert "version" in db_service


def test_health_check_api_service(health_response):
    """Test health check includes API service"""
    api_service = assert_service_exists(health_response, "API")
    assert api_service["status"] == "healthy"
    assert api_service["message"] == "API is running"
    assert api_service["version"] == "0.0.0"


def test_root_endpoint(client):
    """Test root endpoint returns welcome message"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
```

#### D. Update pyproject.toml Template
**File:** `templates/config/pyproject-toml.ts`

Add pytest configuration section:
```toml
[tool.pytest.ini_options]
pythonpath = [".", "tests"]
testpaths = ["tests"]
asyncio_mode = "auto"
```

---

## 4. UPDATE: DB Package Generator

### Location
`src/generators/packages/db/`

### Changes Required

#### A. Update package.json Scripts
**File:** `templates/config/package-json.ts`

**Change script names:**
```diff
- "upgrade": "alembic upgrade head",
- "downgrade": "alembic downgrade -1",
- "revision": "alembic revision --autogenerate",
+ "migrate": "uv run alembic upgrade head",
+ "migrate:down": "uv run alembic downgrade -1",
+ "migrate:new": "uv run alembic revision --autogenerate",
+ "migrate:history": "uv run alembic history",
+ "migrate:current": "uv run alembic current",
```

**Change install:deps:**
```diff
- "install:deps": "python -m pip install -e \".[dev]\""
+ "install:deps": "uv sync"
```

---

## 5. UPDATE: Core Package Generator

### Location
`src/generators/packages/core/`

### Changes Required

#### A. Update Root package.json Scripts
**File:** `templates/config/package-json.ts`

**Change:**
```diff
- "db:upgrade": "pnpm --filter @*/db upgrade",
- "db:revision": "pnpm --filter @*/db revision",
+ "db:migrate": "pnpm --filter @*/db migrate",
+ "db:migrate:new": "pnpm --filter @*/db migrate:new",
+ "db:migrate:down": "pnpm --filter @*/db migrate:down",
+ "db:migrate:history": "pnpm --filter @*/db migrate:history",
```

#### B. Update Makefile Template
**File:** `templates/config/makefile.ts`

**Change:**
```diff
  db-upgrade:
-   pnpm --filter @*/db upgrade
+   pnpm --filter @*/db migrate
```

#### C. Update README Template
**File:** `templates/docs/readme.ts`

Add the "Extending the Template" section with:
- Project renaming instructions
- Quick reference table for common tasks
- Examples for adding API endpoints, UI pages, database models
- Detailed testing section with framework-specific guidance

---

## 6. UPDATE: Project Generator Orchestration

### Location
`src/generators/index.ts`

### Changes Required

Add agent rules generation step:

```typescript
async *generateProject(): AsyncGenerator<GenerationStep> {
  // ... existing steps ...

  // Add after core package generation
  yield {
    step: 'agents',
    message: 'Generating AI agent configuration...',
    currentStep: X,
    totalSteps: Y
  };
  await this.agentRulesGenerator.generate(projectPath, config);

  // ... continue with remaining steps ...
}
```

---

## 7. FILE CHANGES SUMMARY

### New Files to Create in CLI

| Generator | New Template Files |
|-----------|-------------------|
| `agents/` | 14 rule template files (.md and .mdc) |
| `ui/` | `vitest-config.ts`, `test-setup.ts`, `test-utils.ts`, `hero.test.tsx` |
| `api/` | `conftest.ts`, `helpers.ts` |

### Existing Files to Modify

| File | Changes |
|------|---------|
| `ui/templates/config/package-json.ts` | Add `--max-warnings 0` to lint |
| `ui/templates/components/service-card.ts` | Add DevInfo, PACKAGE_INFO, formatWithCode |
| `ui/templates/components/status-panel.ts` | Simplify: remove Card, isLoading prop |
| `ui/templates/routes/index.ts` | Remove QuickStats, add Service type annotations |
| `ui/templates/schemas/health.ts` | Rename type export to `Health` |
| `api/templates/tests/test-health.ts` | Use fixtures instead of global client |
| `api/templates/config/pyproject-toml.ts` | Add pytest.ini_options section |
| `db/templates/config/package-json.ts` | Rename scripts to migrate:* format |
| `core/templates/config/package-json.ts` | Update db:* script names |
| `core/templates/config/makefile.ts` | Update db-upgrade target |
| `core/templates/docs/readme.ts` | Add extension guide section |

### Files to Remove from CLI Generation

| File | Reason |
|------|--------|
| `ui/templates/components/quick-stats.ts` | Component removed in template |
| `ui/templates/components/quick-stats-stories.ts` | Stories for removed component |

---

## 8. TESTING PLAN

After implementing changes:

1. **Generate test project:**
   ```bash
   node lib/quickstart-cli.js create test-upgrade --packages ui,api,db --skip-dependencies -o /tmp
   ```

2. **Verify new files exist:**
   - `.claude/rules/*.md` (7 files)
   - `.cursor/rules/*.mdc` (7 files)
   - `packages/ui/vitest.config.ts`
   - `packages/ui/src/test/setup.ts`
   - `packages/ui/src/test/test-utils.tsx`
   - `packages/api/tests/conftest.py`
   - `packages/api/tests/helpers.py`

3. **Verify script names:**
   - Root package.json has `db:migrate`, `db:migrate:new`, etc.
   - DB package.json has `migrate`, `migrate:new`, etc.
   - Makefile `db-upgrade` calls `migrate`

4. **Run the generated project:**
   ```bash
   cd /tmp/test-upgrade
   make setup
   make db-start
   make dev
   ```

5. **Run tests:**
   ```bash
   make test
   ```

---

## 9. IMPLEMENTATION ORDER

1. **Phase 1: Script Naming (Low Risk)**
   - Update package.json templates (root, db)
   - Update Makefile template
   - Test generation

2. **Phase 2: UI Component Updates (Medium Risk)**
   - Update ServiceCard with DevInfo, PACKAGE_INFO
   - Simplify StatusPanel (remove Card, isLoading)
   - Remove QuickStats component generation
   - Update routes/index.tsx template
   - Update health schema type export
   - Test generation and verify UI renders correctly

3. **Phase 3: Test Infrastructure (Medium Risk)**
   - Add UI test utilities (vitest.config, setup, test-utils)
   - Add hero.test.tsx template
   - Add API fixtures (conftest.py) and helpers (helpers.py)
   - Update test_health.py template
   - Add pyproject.toml pytest config
   - Test generation and verify tests pass

4. **Phase 4: AI Agent Rules (New Feature)**
   - Create agents generator
   - Add all 14 rule templates
   - Integrate into orchestration
   - Test generation

5. **Phase 5: Documentation & Polish (Low Risk)**
   - Update README template with extension guide
   - Update lint configuration (--max-warnings 0)
   - Final testing

---

## 10. ESTIMATED CHANGES

| Category | Files to Create | Files to Modify | Files to Remove |
|----------|-----------------|-----------------|-----------------|
| Agent Rules Generator | ~20 | 1 | 0 |
| UI Component Updates | 1 | 4 | 2 |
| UI Test Infrastructure | 4 | 1 | 0 |
| API Test Infrastructure | 2 | 2 | 0 |
| Script Naming | 0 | 3 | 0 |
| Documentation | 0 | 1 | 0 |
| **Total** | **~27** | **12** | **2** |

---

## Notes

- All template files use TypeScript functions, not static files
- Template variables are injected at generation time
- The `.claude/settings.local.json` file should NOT be generated (it's user-specific)
- Consider adding a `--skip-agent-rules` flag for users who don't want AI configuration
