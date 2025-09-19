# 🤝 Contributing Guide

Thank you for your interest in contributing to AI Kickstart CLI! This guide will help you get started.

## 📋 Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Workflow](#contributing-workflow)
- [Adding Features](#adding-features)
- [Testing Requirements](#testing-requirements)
- [Code Standards](#code-standards)
- [Documentation](#documentation)

## Development Setup

### Prerequisites

- **Node.js** 18+ 
- **Python** 3.11+
- **pnpm** 8+
- **Git**

### Initial Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/your-username/boilerplate.git
cd boilerplate/cli

# 2. Install dependencies
pnpm install

# 3. Build the project
pnpm build

# 4. Run tests to verify setup
pnpm test

# 5. Start development mode
pnpm dev
```

### Development Workflow

```bash
# Start development server
pnpm dev

# Run tests in watch mode
pnpm test:watch

# Build and test before committing
pnpm build && pnpm test:all
```

## Project Structure

```
cli/
├── src/
│   ├── commands/           # CLI command definitions
│   ├── components/         # Ink React UI components
│   ├── generators/         # Code generation system
│   │   ├── index.ts       # Main orchestrator
│   │   └── packages/      # Package-specific generators
│   ├── types/             # TypeScript definitions
│   └── __tests__/         # Test suites
│
├── docs/                  # Documentation
├── lib/                   # Built JavaScript (generated)
└── my-kickstart/          # Test project (generated)
```

## Contributing Workflow

### 1. Pick an Issue

- Check [existing issues](https://github.com/your-org/repo/issues)
- Look for `good first issue` or `help wanted` labels
- Comment on the issue to claim it

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 3. Make Changes

Follow the [code standards](#code-standards) and ensure:
- ✅ Code is properly typed
- ✅ Tests are added/updated
- ✅ Documentation is updated
- ✅ Commits follow [Conventional Commits](https://conventionalcommits.org/)

### 4. Test Your Changes

```bash
# Run all tests
pnpm test:all

# Test specific areas
pnpm test                # Unit tests
pnpm test:integration    # Integration tests
pnpm test:e2e           # End-to-end tests

# Manual testing
pnpm build
node lib/ink-cli.js create test-project --all-features
```

### 5. Submit Pull Request

- Create a clear PR title and description
- Link related issues
- Include screenshots/demos if applicable
- Ensure CI passes

## Adding Features

### Adding a New Package Type

Example: Adding an authentication package

#### 1. Create Generator Structure

```bash
mkdir -p src/generators/packages/auth/templates
```

#### 2. Create Generator Class

```typescript
// src/generators/packages/auth/generator.ts
import { ProjectConfig } from '../../../types/features';

export class AuthPackageGenerator {
  constructor(
    private config: ProjectConfig,
    private outputDir: string
  ) {}

  async generate(): Promise<void> {
    const authDir = path.join(this.outputDir, 'packages', 'auth');
    
    // Generate auth configuration
    await fs.outputFile(
      path.join(authDir, 'auth.config.ts'),
      generateAuthConfig(this.config)
    );
    
    // Generate auth routes
    await fs.outputFile(
      path.join(authDir, 'routes.ts'),
      generateAuthRoutes(this.config)
    );
  }
}
```

#### 3. Create Template Functions

```typescript
// src/generators/packages/auth/templates/config.ts
import { ProjectConfig } from '../../../../types/features';

export function generateAuthConfig(config: ProjectConfig): string {
  return `
export const authConfig = {
  appName: "${config.name}",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  tokenExpiry: "24h",
};
`;
}
```

#### 4. Add to Main Generator

```typescript
// src/generators/index.ts
import { AuthPackageGenerator } from './packages/auth/generator';

export class ProjectGenerator {
  async* generateProject(): AsyncGenerator<GenerationStep> {
    // ... existing code
    
    if (this.config.features.auth) {
      yield { step: 'auth', message: 'Setting up authentication...' };
      await new AuthPackageGenerator(this.config, this.outputDir).generate();
    }
  }
}
```

#### 5. Update Types

```typescript
// src/types/features.ts
export interface ProjectFeatures {
  ui: boolean;
  api: boolean;
  db: boolean;
  auth: boolean; // Add this
}
```

#### 6. Update CLI Commands

```typescript
// src/commands/create.tsx
const CreateArgsSchema = z.object({
  // ... existing args
  authOnly: z.boolean().default(false),
});
```

#### 7. Add Tests

```typescript
// src/__tests__/unit/auth-templates.test.ts
describe('Auth Template Functions', () => {
  it('should generate auth config', () => {
    const result = generateAuthConfig(DEFAULT_CONFIG);
    expect(result).toContain('appName: "test-project"');
    expect(result).toContain('jwtSecret');
  });
});

// src/__tests__/integration/auth-generator.test.ts
describe('AuthPackageGenerator', () => {
  it('should create auth package structure', async () => {
    await generator.generate();
    await assertFileExists('packages/auth/auth.config.ts');
  });
});
```

### Adding a New Template

#### 1. Create Template Function

```typescript
// src/generators/packages/api/templates/middleware.ts
export function generateMiddleware(config: ProjectConfig): string {
  return `
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class CustomMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Add custom logic here
        response = await call_next(request)
        return response
`;
}
```

#### 2. Export from Package

```typescript
// src/generators/packages/api/templates/index.ts
export * from './app';
export * from './config';
export * from './middleware'; // Add this
```

#### 3. Use in Generator

```typescript
// src/generators/packages/api/generator.ts
import { generateMiddleware } from './templates/middleware';

export class APIPackageGenerator {
  async generate(): Promise<void> {
    // ... existing code
    
    await fs.outputFile(
      path.join(apiDir, 'src', 'middleware.py'),
      generateMiddleware(this.config)
    );
  }
}
```

#### 4. Add Tests

```typescript
describe('generateMiddleware', () => {
  it('should create FastAPI middleware', () => {
    const result = generateMiddleware(DEFAULT_CONFIG);
    expect(result).toContain('BaseHTTPMiddleware');
    expect(result).toContain('async def dispatch');
  });
});
```

## Testing Requirements

All contributions must include appropriate tests:

### Required Test Coverage

- **New Template Functions** → Unit tests
- **New Generators** → Integration tests  
- **New CLI Features** → E2E tests
- **Bug Fixes** → Regression tests

### Test Guidelines

```typescript
// ✅ Good test
it('should generate health endpoint with custom name', () => {
  const config = { ...DEFAULT_CONFIG, name: 'my-api' };
  const result = generateHealthEndpoint(config);
  
  expect(result).toContain('title="my-api API"');
  expect(result).toContain('@router.get("/health")');
});

// ❌ Bad test (too vague)
it('should work', () => {
  const result = generateSomething();
  expect(result).toBeTruthy();
});
```

### Running Tests Locally

```bash
# Before submitting PR
pnpm test:all

# Check specific areas
pnpm test src/__tests__/unit/your-feature.test.ts
pnpm test:integration
pnpm test:e2e
```

## Code Standards

### TypeScript Guidelines

- ✅ Use strict TypeScript configuration
- ✅ Define interfaces for all data structures
- ✅ Use meaningful variable names
- ✅ Add JSDoc comments for public APIs
- ✅ Prefer `const` over `let`
- ✅ Use template literals for strings

```typescript
// ✅ Good
interface TemplateParams {
  projectName: string;
  features: ProjectFeatures;
}

export function generateConfig(params: TemplateParams): string {
  return `
# Generated configuration for ${params.projectName}
features = ${JSON.stringify(params.features, null, 2)}
`;
}

// ❌ Bad
export function generateConfig(data: any): string {
  return `stuff = ${data.name}`;
}
```

### Template Function Guidelines

- ✅ Use TypeScript template literals
- ✅ Include proper indentation
- ✅ Handle conditional logic clearly
- ✅ Return complete, valid files
- ✅ Include imports and dependencies

```typescript
// ✅ Good template function
export function generateFastAPIMain(config: ProjectConfig): string {
  const includeDatabase = config.features.db;
  
  return `
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
${includeDatabase ? 'from .database import init_db' : ''}

app = FastAPI(
    title="${config.name} API",
    description="${config.description}",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

${includeDatabase ? `
@app.on_event("startup")
async def startup_event():
    await init_db()
` : ''}

@app.get("/")
async def root():
    return {"message": "Welcome to ${config.name}"}
`.trim();
}
```

### File Organization

```
generators/packages/packagename/
├── generator.ts           # Main generator class
├── templates/            # Template functions
│   ├── index.ts         # Export all templates
│   ├── config.ts        # Configuration files
│   ├── app.ts           # Application code
│   └── tests.ts         # Test files
└── __tests__/           # Package-specific tests
```

### Commit Guidelines

Use [Conventional Commits](https://conventionalcommits.org/):

```bash
# Features
git commit -m "feat(api): add authentication middleware"
git commit -m "feat(ui): add dark mode toggle"

# Bug fixes  
git commit -m "fix(cli): resolve argument parsing error"
git commit -m "fix(templates): correct Python import paths"

# Documentation
git commit -m "docs: update contributing guide"

# Tests
git commit -m "test(api): add integration tests for auth"

# Breaking changes
git commit -m "feat(api)!: change config format"
```

## Documentation

### Required Documentation

- **New Features** → Update README.md and relevant docs
- **API Changes** → Update architecture.md
- **New Templates** → Add examples and usage
- **Breaking Changes** → Migration guide

### Documentation Standards

- ✅ Use clear, concise language
- ✅ Include code examples
- ✅ Add screenshots for UI changes
- ✅ Update table of contents
- ✅ Test all examples

### Updating Documentation

```bash
# Update main documentation
vim README.md
vim docs/architecture.md
vim docs/testing.md

# Add examples
mkdir -p examples/your-feature
echo "Example usage" > examples/your-feature/README.md
```

## Getting Help

- **Questions** → [GitHub Discussions](https://github.com/your-org/repo/discussions)
- **Bug Reports** → [GitHub Issues](https://github.com/your-org/repo/issues)
- **Feature Requests** → [GitHub Issues](https://github.com/your-org/repo/issues)
- **Documentation** → [docs/](./docs/) folder

## Code Review Process

### What We Look For

- ✅ **Functionality** - Does it work as intended?
- ✅ **Tests** - Appropriate test coverage
- ✅ **Code Quality** - Follows standards and best practices
- ✅ **Documentation** - Clear and up-to-date
- ✅ **Performance** - No unnecessary slowdowns
- ✅ **Security** - No security vulnerabilities

### Review Timeline

- **Initial Review** - Within 2-3 business days
- **Follow-up** - Within 1 business day
- **Merge** - After approval and passing CI

Thank you for contributing! 🎉