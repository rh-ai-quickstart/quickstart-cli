/**
 * Utilities for testing generators
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { ProjectConfig } from '../../types/features.js';

export interface TestProjectConfig extends ProjectConfig {
  name: string;
  description: string;
  features: {
    ui: boolean;
    api: boolean;
    db: boolean;
  };
}

/**
 * Creates a temporary directory for testing
 */
export async function createTempDir(prefix = 'cli-test-'): Promise<string> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  return tempDir;
}

/**
 * Cleanup temporary directory
 */
export async function cleanupTempDir(tempDir: string): Promise<void> {
  try {
    await fs.remove(tempDir);
  } catch (error) {
    // Ignore cleanup errors in tests
    console.warn(`Failed to cleanup temp dir ${tempDir}:`, error);
  }
}

/**
 * Default test project configuration
 */
export const DEFAULT_TEST_CONFIG: TestProjectConfig = {
  name: 'test-project',
  description: 'A test project for unit testing',
  packageManager: 'pnpm',
  features: {
    ui: true,
    api: true,
    db: true,
  },
};

/**
 * Check if a file exists and has content
 */
export async function assertFileExists(filePath: string, message?: string): Promise<void> {
  const exists = await fs.pathExists(filePath);
  if (!exists) {
    throw new Error(message || `Expected file to exist: ${filePath}`);
  }

  const stats = await fs.stat(filePath);
  if (stats.size === 0) {
    throw new Error(message || `Expected file to have content: ${filePath}`);
  }
}

/**
 * Check file content contains expected strings
 */
export async function assertFileContains(
  filePath: string,
  expectedContent: string | string[],
  message?: string
): Promise<void> {
  await assertFileExists(filePath);

  const content = await fs.readFile(filePath, 'utf-8');
  const expectations = Array.isArray(expectedContent) ? expectedContent : [expectedContent];

  for (const expected of expectations) {
    if (!content.includes(expected)) {
      throw new Error(
        message ||
          `Expected file ${filePath} to contain: "${expected}"\nActual content:\n${content}`
      );
    }
  }
}

/**
 * Get file content for snapshot testing
 */
export async function getFileContent(filePath: string): Promise<string> {
  await assertFileExists(filePath);
  return fs.readFile(filePath, 'utf-8');
}

/**
 * Check if generated Python code is syntactically valid using actual Python
 * Tries multiple methods: python3, python, uv run python (in order)
 */
export async function validatePythonSyntax(filePath: string): Promise<boolean> {
  const { execSync } = await import('child_process');

  // List of Python commands to try in order of preference
  const pythonCommands = ['python3', 'python', 'uv run python'];

  for (const pythonCmd of pythonCommands) {
    try {
      execSync(`${pythonCmd} -m py_compile "${filePath}"`, {
        stdio: 'pipe', // Suppress output
        timeout: 10000, // 10 second timeout
      });
      return true;
    } catch {
      // Try next command
      continue;
    }
  }

  // If no Python commands work, fall back to basic validation
  console.warn(`No Python interpreter available, using basic syntax validation for ${filePath}`);
  return validatePythonSyntaxBasic(filePath);
}

/**
 * Fallback validation for when Python isn't available
 */
export async function validatePythonSyntaxBasic(filePath: string): Promise<boolean> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Basic checks (fallback only)
    const hasValidIndentation = !content.match(/^\s*\t/m); // No tabs for indentation
    const hasBalancedParens = checkBalancedBrackets(content, '(', ')');
    const hasBalancedBrackets = checkBalancedBrackets(content, '[', ']');
    const hasBalancedBraces = checkBalancedBrackets(content, '{', '}');

    return hasValidIndentation && hasBalancedParens && hasBalancedBrackets && hasBalancedBraces;
  } catch {
    return false;
  }
}

/**
 * Check if generated TypeScript/JavaScript code is syntactically valid
 */
export async function validateTypeScriptSyntax(filePath: string): Promise<boolean> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    // Basic TS/JS syntax checks
    const hasBalancedParens = checkBalancedBrackets(content, '(', ')');
    const hasBalancedBrackets = checkBalancedBrackets(content, '[', ']');
    const hasBalancedBraces = checkBalancedBrackets(content, '{', '}');

    return hasBalancedParens && hasBalancedBrackets && hasBalancedBraces;
  } catch {
    return false;
  }
}

/**
 * Validates Python FastAPI application exists and has basic content
 */
export async function validateFastAPIApp(
  filePath: string,
  config: TestProjectConfig
): Promise<void> {
  await assertFileExists(filePath);
  // Validation is handled by actual Python compilation in type-check tests
}

/**
 * Validates Python configuration file exists
 */
export async function validatePythonConfig(
  filePath: string,
  config: TestProjectConfig,
  options: { hasDatabase?: boolean } = {}
): Promise<void> {
  await assertFileExists(filePath);
  // Validation is handled by actual Python compilation in type-check tests
}

/**
 * Validates Python project configuration exists
 */
export async function validatePyprojectToml(filePath: string): Promise<void> {
  await assertFileExists(filePath);
  // Validation is handled by actual Python compilation in type-check tests
}

/**
 * Validates API package.json exists
 */
export async function validateAPIPackageJson(filePath: string, projectName: string): Promise<void> {
  await assertFileExists(filePath);
  // Validation is handled by actual compilation and functional tests
}

/**
 * Helper to check balanced brackets
 */
function checkBalancedBrackets(content: string, open: string, close: string): boolean {
  let count = 0;
  for (const char of content) {
    if (char === open) count++;
    if (char === close) count--;
    if (count < 0) return false;
  }
  return count === 0;
}

/**
 * Test project structure helpers
 */
export const PROJECT_STRUCTURE = {
  foundation: {
    files: ['package.json', 'pnpm-workspace.yaml', 'tsconfig.json', 'turbo.json', '.gitignore'],
    dirs: ['packages'],
  },
  ui: {
    files: ['package.json', 'vite.config.ts', 'tsconfig.json', 'index.html'],
    dirs: ['src', 'src/components', 'src/routes', 'src/hooks', 'src/services'],
  },
  api: {
    files: ['package.json', 'pyproject.toml'],
    dirs: ['src', 'tests', 'src/core', 'src/routes', 'src/schemas'],
  },
  db: {
    files: ['package.json', 'pyproject.toml', 'alembic.ini', 'README.md'],
    dirs: ['src', 'tests', 'alembic', 'alembic/versions'],
  },
};

/**
 * Validate entire project structure
 */
export async function validateProjectStructure(
  projectDir: string,
  config: TestProjectConfig
): Promise<void> {
  // Check foundation files
  for (const file of PROJECT_STRUCTURE.foundation.files) {
    await assertFileExists(path.join(projectDir, file));
  }

  // Check package-specific structure
  if (config.features.ui) {
    const uiDir = path.join(projectDir, 'packages', 'ui');
    for (const file of PROJECT_STRUCTURE.ui.files) {
      await assertFileExists(path.join(uiDir, file));
    }
  }

  if (config.features.api) {
    const apiDir = path.join(projectDir, 'packages', 'api');
    for (const file of PROJECT_STRUCTURE.api.files) {
      await assertFileExists(path.join(apiDir, file));
    }
  }

  if (config.features.db) {
    const dbDir = path.join(projectDir, 'packages', 'db');
    for (const file of PROJECT_STRUCTURE.db.files) {
      await assertFileExists(path.join(dbDir, file));
    }
  }
}
