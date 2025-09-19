/**
 * Generator Type Checking Tests
 *
 * Tests that run individual generators and validate generated code with actual type checkers:
 * - TypeScript files with tsc
 * - Python files with mypy
 *
 * Note: These tests install dependencies, so they're slower than syntax tests.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import { UIPackageGenerator } from '../../generators/packages/ui/generator.js';
import { APIPackageGenerator } from '../../generators/packages/api/generator.js';
import {
  createTempDir,
  cleanupTempDir,
  DEFAULT_TEST_CONFIG,
  assertFileExists,
} from '../utils/test-helpers.js';

describe('Generator Type Checking', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('generator-typecheck-test-');
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('UI Package Type Checking', () => {
    it('should generate TypeScript files that pass tsc type checking', async () => {
      // Generate UI package
      const generator = new UIPackageGenerator(tempDir, DEFAULT_TEST_CONFIG);
      await generator.generate();

      const uiDir = path.join(tempDir, 'packages', 'ui');

      // Verify the UI package was generated
      expect(await fs.pathExists(uiDir)).toBe(true);
      await assertFileExists(path.join(uiDir, 'tsconfig.json'));
      await assertFileExists(path.join(uiDir, 'package.json'));

      // Install dependencies (required for type checking)
      console.log('Installing UI dependencies for type checking...');
      try {
        execSync('pnpm install', {
          cwd: uiDir,
          stdio: 'pipe',
          timeout: 120000,
        });
      } catch (error) {
        throw new Error(`Failed to install UI dependencies: ${error}`);
      }

      // Run TypeScript compiler type checking
      console.log('Running TypeScript type checking on generated UI files...');
      try {
        const result = execSync('pnpm type-check', {
          cwd: uiDir,
          encoding: 'utf-8',
          timeout: 60000,
        });
        console.log('✅ TypeScript type checking passed for UI package');
      } catch (error: any) {
        console.error('TypeScript type checking failed:');
        console.error(error.stdout || error.message);
        throw new Error(
          `TypeScript type checking failed for UI package: ${error.stdout || error.message}`
        );
      }
    }, 180000); // 3 minute timeout

    it('should generate valid React/Vite configuration files', async () => {
      const generator = new UIPackageGenerator(tempDir, DEFAULT_TEST_CONFIG);
      await generator.generate();

      const uiDir = path.join(tempDir, 'packages', 'ui');

      // Verify all key TypeScript files exist
      const tsFiles = [
        'src/main.tsx',
        'src/lib/utils.ts',
        'src/components/atoms/card/card.tsx',
        'src/components/atoms/badge/badge.tsx',
        'src/components/atoms/button/button.tsx',
        'src/components/atoms/separator/separator.tsx',
        'src/components/atoms/tooltip/tooltip.tsx',
        'src/components/atoms/dropdown-menu/dropdown-menu.tsx',
        'src/components/theme-provider/theme-provider.tsx',
        'src/components/mode-toggle/mode-toggle.tsx',
        'src/routes/__root.tsx',
        'src/routes/index.tsx',
        'vite.config.ts',
      ];

      for (const file of tsFiles) {
        await assertFileExists(path.join(uiDir, file));
      }

      console.log('✅ All expected TypeScript files generated');
    });
  });

  describe('API Package Type Checking', () => {
    it('should generate Python files that pass mypy type checking', async () => {
      // Generate API package without DB to avoid local editable ref during uv sync
      const configWithoutDb = {
        ...DEFAULT_TEST_CONFIG,
        features: { ...DEFAULT_TEST_CONFIG.features, db: false },
      };
      const generator = new APIPackageGenerator(configWithoutDb, tempDir);
      await generator.generate();

      const apiDir = path.join(tempDir, 'packages', 'api');

      // Verify the API package was generated
      expect(await fs.pathExists(apiDir)).toBe(true);
      await assertFileExists(path.join(apiDir, 'pyproject.toml'));

      // Install Python dependencies including dev dependencies
      console.log('Installing Python dependencies for type checking...');
      try {
        execSync('uv sync --extra dev', {
          cwd: apiDir,
          stdio: 'pipe',
          timeout: 120000,
        });
      } catch (error) {
        throw new Error(`Failed to install Python dependencies: ${error}`);
      }

      // Run mypy type checking on all Python files
      console.log('Running mypy type checking on generated Python files...');
      try {
        const result = execSync('uv run mypy src/', {
          cwd: apiDir,
          encoding: 'utf-8',
          timeout: 60000,
        });
        console.log('✅ mypy type checking passed for API package');
      } catch (error: any) {
        console.error('mypy type checking failed:');
        console.error(error.stdout || error.message);
        throw new Error(
          `mypy type checking failed for API package: ${error.stdout || error.message}`
        );
      }
    }, 180000); // 3 minute timeout

    it('should generate valid Python configuration files', async () => {
      const configWithDb = {
        ...DEFAULT_TEST_CONFIG,
        features: { ...DEFAULT_TEST_CONFIG.features, db: true },
      };
      // Generate DB package as it's referenced by API's pyproject when db is enabled
      const { DBPackageGenerator } = await import('../../generators/packages/db/generator.js');
      const dbGen = new DBPackageGenerator(tempDir, configWithDb);
      await dbGen.generate();
      const generator = new APIPackageGenerator(configWithDb, tempDir);
      await generator.generate();

      const apiDir = path.join(tempDir, 'packages', 'api');

      // Verify all key Python files exist
      const pythonFiles = [
        'src/main.py',
        'src/core/config.py',
        'src/routes/health.py',
        'tests/test_health.py',
      ];

      for (const file of pythonFiles) {
        await assertFileExists(path.join(apiDir, file));
      }

      console.log('✅ All expected Python files generated');
    });
  });

  describe('Feature-Conditional Type Checking', () => {
    it('should pass type checking when API features are enabled in UI', async () => {
      // Test UI with API integration
      const configWithApi = {
        ...DEFAULT_TEST_CONFIG,
        features: { ...DEFAULT_TEST_CONFIG.features, api: true },
      };
      const generator = new UIPackageGenerator(tempDir, configWithApi);
      await generator.generate();

      const uiDir = path.join(tempDir, 'packages', 'ui');

      // Verify SystemHealthDashboard is generated when API is enabled
      await assertFileExists(path.join(uiDir, 'src', 'services', 'health.ts'));
      await assertFileExists(path.join(uiDir, 'src', 'hooks', 'health.ts'));

      // Install and type check
      execSync('pnpm install', { cwd: uiDir, stdio: 'pipe', timeout: 120000 });

      try {
        execSync('pnpm type-check', {
          cwd: uiDir,
          encoding: 'utf-8',
          timeout: 60000,
        });
        console.log('✅ UI with API features passes type checking');
      } catch (error: any) {
        throw new Error(
          `UI with API features type checking failed: ${error.stdout || error.message}`
        );
      }
    }, 180000);

    it('should pass type checking when DB features are enabled in API', async () => {
      // Test API with database integration
      const configWithDb = {
        ...DEFAULT_TEST_CONFIG,
        features: { ...DEFAULT_TEST_CONFIG.features, db: true },
      };
      const { DBPackageGenerator } = await import('../../generators/packages/db/generator.js');
      const dbGen = new DBPackageGenerator(tempDir, configWithDb);
      await dbGen.generate();
      const generator = new APIPackageGenerator(configWithDb, tempDir);
      await generator.generate();

      const apiDir = path.join(tempDir, 'packages', 'api');

      // Install and type check
      execSync('uv sync --extra dev', { cwd: apiDir, stdio: 'pipe', timeout: 120000 });

      try {
        execSync('uv run mypy src/', {
          cwd: apiDir,
          encoding: 'utf-8',
          timeout: 60000,
        });
        console.log('✅ API with DB features passes type checking');
      } catch (error: any) {
        throw new Error(
          `API with DB features type checking failed: ${error.stdout || error.message}`
        );
      }
    }, 180000);
  });
});
