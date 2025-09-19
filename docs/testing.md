# 🧪 Testing Guide

This document explains the comprehensive testing strategy for the AI Kickstart CLI.

## 📋 Table of Contents

- [Overview](#overview)
- [Testing Philosophy](#testing-philosophy)
- [Test Types](#test-types)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

We use a **three-layer testing pyramid** that provides confidence at different levels:

```
        🌍 E2E Tests (CLI → Real Tools)
       📦📦 Integration Tests (Generators)
      🧪🧪🧪 Unit Tests (Template Functions)
```

### Testing Tools

- **Vitest** - Fast, modern test runner with TypeScript support
- **ink-testing-library** - Testing CLI React components
- **Real Toolchains** - Python (pytest, mypy, ruff), Node.js (ESLint, TypeScript)
- **Temporary Directories** - Isolated file system testing
- **Child Process** - Testing actual CLI execution

## Testing Philosophy

### Core Principles

1. **Test Generated Code Quality** - Don't just test that files exist, test that they work
2. **Real Tool Validation** - Use actual Python/Node.js tools to validate generated code
3. **Fast Feedback Loop** - Unit tests run in seconds, integration tests in minutes
4. **Confidence in Releases** - E2E tests ensure user success
5. **Developer Experience** - Tests should be easy to write and debug

### What We Test

✅ **Template Function Output** - Correct code generation  
✅ **File Structure Creation** - Proper directory layout  
✅ **Python Syntax Validation** - Using `python -m py_compile`  
✅ **TypeScript Compilation** - Using `tsc --noEmit`  
✅ **Linting Passes** - Using ruff, ESLint  
✅ **Tests Pass** - Generated tests run successfully  
✅ **Servers Start** - FastAPI/Vite dev servers work  
✅ **Build Process** - Production builds succeed  
✅ **CLI Interface** - Argument parsing and user flow  

## Test Types

### 1. Unit Tests 🧪

**Purpose:** Test individual template functions  
**Speed:** ⚡ Very Fast (< 30 seconds)  
**Scope:** Single functions, pure logic

```typescript
// src/__tests__/unit/api-templates.test.ts
describe('API Template Functions', () => {
  it('should generate valid FastAPI main file', () => {
    const config = { name: 'test-app', description: 'Test app' };
    const result = generateMainPy(config);
    
    expect(result).toContain('from fastapi import FastAPI');
    expect(result).toContain('title="test-app API"');
    expect(result).toContain('description="Test app"');
  });

  it('should include CORS middleware', () => {
    const result = generateMainPy(DEFAULT_CONFIG);
    
    expect(result).toContain('from fastapi.middleware.cors import CORSMiddleware');
    expect(result).toContain('app.add_middleware(CORSMiddleware');
  });
});
```

**Run with:** `pnpm test`

### 2. Integration Tests 📦

**Purpose:** Test full package generation with file system  
**Speed:** 🐌 Medium (2-5 minutes)  
**Scope:** Complete generators, file creation, basic validation

```typescript
// src/__tests__/integration/api-generator.test.ts
describe('APIPackageGenerator', () => {
  let tempDir: string;
  let generator: APIPackageGenerator;

  beforeEach(async () => {
    tempDir = await createTempDir();
    generator = new APIPackageGenerator(DEFAULT_CONFIG, tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should create all required files', async () => {
    await generator.generate();

    const apiDir = path.join(tempDir, 'packages', 'api');
    
    // Verify structure
    await assertFileExists(path.join(apiDir, 'src', 'main.py'));
    await assertFileExists(path.join(apiDir, 'pyproject.toml'));
    await assertFileExists(path.join(apiDir, 'tests', 'test_health.py'));
    
    // Verify content
    await assertFileContains(
      path.join(apiDir, 'src', 'main.py'),
      'from fastapi import FastAPI'
    );
  });

  it('should generate syntactically valid Python', async () => {
    await generator.generate();

    const pythonFiles = [
      'src/main.py',
      'src/core/config.py',
      'tests/test_health.py'
    ];

    for (const file of pythonFiles) {
      const filePath = path.join(tempDir, 'packages', 'api', file);
      const isValid = await validatePythonSyntax(filePath);
      expect(isValid).toBe(true);
    }
  });
});
```

**Run with:** `pnpm test:integration`

### 3. End-to-End Tests 🌍

**Purpose:** Test complete user workflow with real tools  
**Speed:** 🐢 Slow (10+ minutes)  
**Scope:** CLI execution, dependency installation, tool validation

```typescript
// src/__tests__/e2e/cli-end-to-end.test.ts
describe('CLI End-to-End Tests', () => {
  it('should generate working Python API project', async () => {
    const projectName = 'test-api-project';
    
    // 1. Generate project with CLI
    execSync(`node cli.js create ${projectName} --api-only`, {
      timeout: 60000
    });

    const apiDir = path.join(tempDir, projectName, 'packages', 'api');

    // 2. Install Python dependencies
    execSync('python3 -m pip install -e .[dev]', {
      cwd: apiDir,
      timeout: 120000
    });

    // 3. Run actual Python tools
    execSync('python3 -m ruff check src/', { cwd: apiDir });
    execSync('python3 -m mypy src/', { cwd: apiDir });
    
    const testResult = execSync('python3 -m pytest tests/ -v', {
      cwd: apiDir,
      encoding: 'utf-8'
    });
    
    expect(testResult).toContain('passed');
    expect(testResult).not.toContain('FAILED');

    // 4. Test server startup
    const serverTest = new Promise((resolve, reject) => {
      const server = spawn('python3', ['-m', 'uvicorn', 'src.main:app'], {
        cwd: apiDir
      });

      server.stdout.on('data', (data) => {
        if (data.toString().includes('Application startup complete')) {
          const healthCheck = execSync('curl -f http://localhost:8000/health/');
          server.kill();
          resolve(healthCheck);
        }
      });
    });

    const healthResponse = await serverTest;
    expect(healthResponse).toContain('status');
  }, 180000); // 3 minute timeout
});
```

**Run with:** `pnpm test:e2e`

## Running Tests

### Quick Commands

```bash
# Fast feedback loop (30 seconds)
pnpm test

# Deep validation (2-5 minutes)
pnpm test:integration  

# Complete confidence (10 minutes)
pnpm test:e2e

# Everything (15 minutes)
pnpm test:all

# Watch mode for development
pnpm test:watch

# Coverage report
pnpm test:coverage

# Test UI (visual test runner)
pnpm test:ui
```

### Debugging Tests

```bash
# Run specific test file
pnpm test src/__tests__/unit/api-templates.test.ts

# Run tests matching pattern
pnpm test --grep "API"

# Verbose output
pnpm test --reporter=verbose

# Debug mode
pnpm test --inspect-brk
```

## Writing Tests

### Unit Test Guidelines

✅ **Do:**
- Test template function logic
- Verify generated content contains expected code
- Test conditional logic (feature flags)
- Use descriptive test names
- Group related tests in describe blocks

❌ **Don't:**
- Test file system operations (use integration tests)
- Test external dependencies
- Duplicate integration test scenarios

```typescript
// ✅ Good unit test
it('should include database settings when DB feature is enabled', () => {
  const config = { ...DEFAULT_CONFIG, features: { db: true } };
  const result = generateConfigPy(config);
  
  expect(result).toContain('DATABASE_URL');
  expect(result).toContain('postgresql://');
});

// ❌ Bad unit test (should be integration test)
it('should create config file on disk', async () => {
  await generator.generate(); // File system operation
  expect(await fs.pathExists('config.py')).toBe(true);
});
```

### Integration Test Guidelines

✅ **Do:**
- Use temporary directories
- Clean up after each test
- Test complete package generation
- Validate file structure and content
- Test error conditions

❌ **Don't:**
- Install actual dependencies (use E2E tests)
- Test CLI argument parsing (use unit tests)
- Run external tools like pytest

```typescript
// ✅ Good integration test
describe('UIPackageGenerator', () => {
  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should generate TypeScript configuration', async () => {
    await generator.generate();
    
    const tsconfigPath = path.join(tempDir, 'packages', 'ui', 'tsconfig.json');
    await assertFileExists(tsconfigPath);
    
    const tsconfig = await fs.readJSON(tsconfigPath);
    expect(tsconfig.compilerOptions.strict).toBe(true);
  });
});
```

### E2E Test Guidelines

✅ **Do:**
- Test complete user workflows
- Use actual CLI binary
- Install real dependencies
- Run real development tools
- Test server startup when applicable

❌ **Don't:**
- Test internal implementation details
- Duplicate unit/integration test logic
- Make tests dependent on each other

```typescript
// ✅ Good E2E test
it('should generate working React app that builds', async () => {
  // Generate with real CLI
  execSync(`node cli.js create test-ui --ui-only`);
  
  const uiDir = path.join(tempDir, 'test-ui', 'packages', 'ui');
  
  // Install real dependencies
  execSync('pnpm install', { cwd: uiDir });
  
  // Run real tools
  execSync('pnpm type-check', { cwd: uiDir });
  execSync('pnpm build', { cwd: uiDir });
  
  // Verify build output
  expect(await fs.pathExists(path.join(uiDir, 'dist', 'index.html'))).toBe(true);
});
```

### Test Utilities

Use the helper functions in `src/__tests__/utils/test-helpers.ts`:

```typescript
// Temporary directory management
const tempDir = await createTempDir('my-test-');
await cleanupTempDir(tempDir);

// File assertions
await assertFileExists('path/to/file.py');
await assertFileContains('path/to/file.py', ['import fastapi', 'app = FastAPI']);

// Syntax validation (uses real Python)
const isValid = await validatePythonSyntax('path/to/file.py');
expect(isValid).toBe(true);

// Project structure validation
await validateProjectStructure(projectDir, config);
```

## CI/CD Integration

### GitHub Actions

Tests run automatically on:
- **Pull Requests** - All test types
- **Main Branch** - All test types + deployment
- **Release Tags** - Full test suite + publish

Configuration in `.github/workflows/`:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm test

  integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm test:integration

  e2e:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.11', '3.12']
        node-version: ['18', '20']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
      - run: pnpm install
      - run: pnpm test:e2e
```

### Local Pre-commit

```bash
# Install pre-commit hook
echo "pnpm test" > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Or use pre-commit tool
pip install pre-commit
pre-commit install
```

## Troubleshooting

### Common Issues

#### Tests Timeout
```bash
# Increase timeout
pnpm test --testTimeout=60000

# Run specific test
pnpm test --grep "slow test name"
```

#### Python Not Found
```bash
# Check Python installation
python3 --version
which python3

# Use specific Python version
PYTHON=python3.11 pnpm test:e2e
```

#### Permission Errors
```bash
# Fix temp directory permissions
chmod -R 755 /tmp/cli-test-*

# Clean up old temp directories
rm -rf /tmp/cli-test-*
```

#### Memory Issues
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm test:e2e
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* pnpm test

# Debug specific test
node --inspect-brk ./node_modules/.bin/vitest run specific-test.ts
```

### Test Isolation

Each test runs in isolation:
- **Unit Tests** - No shared state
- **Integration Tests** - Unique temporary directories
- **E2E Tests** - Separate processes and ports

### Performance Tips

1. **Use Unit Tests** for fast feedback
2. **Mock External Calls** in integration tests
3. **Parallel E2E Tests** with different ports
4. **Clean Up Resources** to prevent memory leaks
5. **Cache Dependencies** in CI

This testing strategy ensures that generated projects actually work for users while maintaining fast development cycles.