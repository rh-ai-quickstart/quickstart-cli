# 🏗️ Architecture Guide

This document explains the internal architecture of the AI QuickStart CLI tool.

## 📋 Table of Contents

- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Template System](#template-system)
- [Generator Architecture](#generator-architecture)
- [CLI Components](#cli-components)
- [Testing Architecture](#testing-architecture)
- [Extension Points](#extension-points)

## Overview

The CLI is built with a modular architecture that separates concerns:

```
User Interface (Ink React) → Command Parser → Project Generator → Package Generators → Template Functions → File System
```

### Key Design Principles

1. **Type Safety** - Full TypeScript throughout
2. **Modularity** - Each package type has its own generator
3. **Testability** - Three-layer testing strategy
4. **Extensibility** - Easy to add new package types
5. **Real Validation** - Generated code tested with actual toolchains

## Directory Structure

```
src/
├── commands/           # CLI command definitions
│   ├── create.tsx     # Main project creation command
│   └── registry.ts    # Command registration
│
├── components/         # Ink React UI components
│   ├── App.tsx        # Main application component
│   ├── ProjectSetupForm.tsx
│   └── ProjectGenerationSimple.tsx
│
├── generators/         # Code generation system
│   ├── index.ts       # Main project orchestrator
│   └── packages/      # Package-specific generators
│       ├── ui/        # React frontend generator
│       ├── api/       # Python FastAPI generator
│       └── db/        # Database generator
│
├── types/             # TypeScript type definitions
│   └── features.ts    # Project configuration types
│
└── __tests__/         # Test suites
    ├── unit/          # Template function tests
    ├── integration/   # Generator tests
    └── e2e/           # End-to-end CLI tests
```

## Template System

### TypeScript Template Functions

Instead of external template files, we use TypeScript functions that return template strings:

```typescript
export function generateMainPy(config: ProjectConfig): string {
  return `
from fastapi import FastAPI

app = FastAPI(
    title="${config.name} API",
    description="${config.description}",
    version="0.0.0",
)

@app.get("/")
async def root():
    return {"message": "Hello from ${config.name}"}
  `;
}
```

**Benefits:**
- ✅ Type safety for template parameters
- ✅ IDE support (autocomplete, refactoring)
- ✅ Easy unit testing
- ✅ No external file dependencies
- ✅ Conditional logic with native TypeScript

### Template Organization

Templates are organized by package type:

```
generators/packages/
├── ui/templates/
│   ├── components.ts  # React components
│   ├── routes.ts      # Router configuration
│   └── config.ts      # Build configuration
│
├── api/templates/
│   ├── app.ts         # FastAPI application
│   ├── config.ts      # Python configuration
│   └── tests.ts       # Python test templates
│
└── db/templates/
    ├── database.ts    # Database connection
    └── config.ts      # Migration configuration
```

## Generator Architecture

### Main Project Generator

The `ProjectGenerator` in `src/generators/index.ts` orchestrates the entire generation process:

```typescript
export class ProjectGenerator {
  async* generateProject(): AsyncGenerator<GenerationStep> {
    yield { step: 'foundation', message: 'Creating project structure...' };
    await this.generateFoundation();
    
    if (this.config.features.ui) {
      yield { step: 'ui', message: 'Setting up UI package...' };
      await new UIPackageGenerator(this.config, this.outputDir).generate();
    }
    
    if (this.config.features.api) {
      yield { step: 'api', message: 'Setting up API package...' };
      await new APIPackageGenerator(this.config, this.outputDir).generate();
    }
    
    // ... more steps
  }
}
```

### Package Generators

Each package type has its own generator that follows the same interface:

```typescript
interface PackageGenerator {
  generate(): Promise<void>;
}
```

#### Example: API Package Generator

```typescript
export class APIPackageGenerator {
  constructor(
    private config: ProjectConfig,
    private outputDir: string
  ) {}

  async generate(): Promise<void> {
    const apiDir = path.join(this.outputDir, 'packages', 'api');
    
    // Generate Python files
    await fs.outputFile(
      path.join(apiDir, 'src', 'main.py'),
      generateMainPy(this.config)
    );
    
    // Generate configuration
    await fs.outputFile(
      path.join(apiDir, 'pyproject.toml'),
      generatePyprojectToml(this.config)
    );
    
    // Generate tests
    await fs.outputFile(
      path.join(apiDir, 'tests', 'test_health.py'),
      generateHealthTests(this.config)
    );
  }
}
```

## CLI Components

### Component Hierarchy

```
App (Main orchestrator)
├── ProjectSetupForm (Interactive configuration)
├── ProjectGenerationSimple (Progress display)
├── SuccessMessage (Completion)
└── ErrorMessage (Error handling)
```

### State Management

The CLI uses React state to manage the generation flow:

```typescript
type AppState = 'welcome' | 'setup' | 'generating' | 'success' | 'error';

interface AppData {
  config?: ProjectConfig;
  error?: string;
  outputPath?: string;
}
```

### Command System

Commands are registered in `src/commands/registry.ts`:

```typescript
export const commands: Command[] = [
  createCommand,
  addPackageCommand,
  removePackageCommand,
];
```

Each command defines:
- **Name** - Command identifier
- **Description** - Help text
- **Usage** - Syntax example
- **Examples** - Usage examples
- **Component** - Ink React component
- **parseArgs** - Argument parser function

## Testing Architecture

### Three-Layer Strategy

#### 1. Unit Tests (`src/__tests__/unit/`)
Test individual template functions:

```typescript
describe('API Template Functions', () => {
  it('should generate valid FastAPI main file', () => {
    const result = generateMainPy(config);
    expect(result).toContain('from fastapi import FastAPI');
    expect(result).toContain(`title="${config.name} API"`);
  });
});
```

#### 2. Integration Tests (`src/__tests__/integration/`)
Test full package generation with real file system:

```typescript
describe('APIPackageGenerator', () => {
  it('should create all required files', async () => {
    await generator.generate();
    
    await assertFileExists('packages/api/src/main.py');
    await assertFileExists('packages/api/pyproject.toml');
    await validatePythonSyntax('packages/api/src/main.py');
  });
});
```

#### 3. End-to-End Tests (`src/__tests__/e2e/`)
Test complete user workflow with actual tools:

```typescript
describe('CLI End-to-End', () => {
  it('should generate working Python API', async () => {
    // Generate project with CLI
    execSync(`node cli.js create test-project --api-only`);
    
    // Install dependencies
    execSync('pip install -e .[dev]', { cwd: apiDir });
    
    // Run actual Python tools
    execSync('python -m pytest tests/', { cwd: apiDir });
    execSync('python -m mypy src/', { cwd: apiDir });
    execSync('python -m ruff check src/', { cwd: apiDir });
  });
});
```

### Test Utilities

Common testing utilities in `src/__tests__/utils/test-helpers.ts`:

```typescript
export async function createTempDir(): Promise<string>
export async function validatePythonSyntax(filePath: string): Promise<boolean>
export async function assertFileExists(filePath: string): Promise<void>
export async function assertFileContains(filePath: string, content: string): Promise<void>
```

## Extension Points

### Adding a New Package Type

1. **Create Generator Class**
```typescript
// src/generators/packages/newtype/generator.ts
export class NewTypePackageGenerator {
  async generate(): Promise<void> {
    // Implementation
  }
}
```

2. **Create Template Functions**
```typescript
// src/generators/packages/newtype/templates/config.ts
export function generateConfig(config: ProjectConfig): string {
  return `# Generated config for ${config.name}`;
}
```

3. **Update Main Generator**
```typescript
// src/generators/index.ts
if (this.config.features.newtype) {
  yield { step: 'newtype', message: 'Setting up new package...' };
  await new NewTypePackageGenerator(this.config, this.outputDir).generate();
}
```

4. **Add Feature Flag**
```typescript
// src/types/features.ts
export interface ProjectFeatures {
  ui: boolean;
  api: boolean;
  db: boolean;
  newtype: boolean; // Add this
}
```

5. **Update CLI Arguments**
```typescript
// src/commands/create.tsx
const CreateArgsSchema = z.object({
  // ... existing args
  newtypeOnly: z.boolean().default(false),
});
```

### Adding New Templates

1. Create template function in appropriate package
2. Export from package's templates index
3. Import and use in generator
4. Add unit tests for template function
5. Add integration tests for generator

### Customizing Generation Flow

The generation flow can be customized by:

1. **Modifying Step Messages** - Update yield messages
2. **Adding Validation Steps** - Add syntax/lint checks
3. **Custom Post-Processing** - Add build or setup steps
4. **Conditional Logic** - Based on feature flags or config

This architecture provides a solid foundation for extending the CLI with new package types, templates, and generation workflows.