/**
 * Integration tests for API package generator
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import { APIPackageGenerator } from '../../../../generators/packages/api/generator.js';
import {
  createTempDir,
  cleanupTempDir,
  DEFAULT_TEST_CONFIG,
  assertFileExists,
  validatePythonSyntax,
  PROJECT_STRUCTURE,
} from '../../../utils/test-helpers.js';

describe('APIPackageGenerator', () => {
  let tempDir: string;
  let generator: APIPackageGenerator;

  beforeEach(async () => {
    tempDir = await createTempDir('api-generator-test-');
    generator = new APIPackageGenerator(DEFAULT_TEST_CONFIG, tempDir);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('generate()', () => {
    it('should create all required API package files', async () => {
      await generator.generate();

      const apiDir = path.join(tempDir, 'packages', 'api');

      // Check all expected files exist
      for (const file of PROJECT_STRUCTURE.api.files) {
        await assertFileExists(path.join(apiDir, file));
      }

      // Check all expected directories exist
      for (const dir of PROJECT_STRUCTURE.api.dirs) {
        const dirPath = path.join(apiDir, dir);
        expect(await fs.pathExists(dirPath)).toBe(true);
      }
    });

    it('should generate package.json file', async () => {
      await generator.generate();

      const packageJsonPath = path.join(tempDir, 'packages', 'api', 'package.json');
      await assertFileExists(packageJsonPath);
    });

    it('should generate pyproject.toml file', async () => {
      await generator.generate();

      const pyprojectPath = path.join(tempDir, 'packages', 'api', 'pyproject.toml');
      await assertFileExists(pyprojectPath);
    });

    it('should generate main.py file', async () => {
      await generator.generate();

      const mainPyPath = path.join(tempDir, 'packages', 'api', 'src', 'main.py');
      await assertFileExists(mainPyPath);
    });

    it('should generate syntactically valid Python files', async () => {
      await generator.generate();

      const pythonFiles = [
        'src/main.py',
        'src/core/config.py',
        'src/routes/health.py',
        'tests/test_health.py',
      ];

      for (const file of pythonFiles) {
        const filePath = path.join(tempDir, 'packages', 'api', file);
        const isValid = await validatePythonSyntax(filePath);
        expect(isValid).toBe(true);
      }
    });

    it('should generate config files with database features enabled', async () => {
      const configWithDb = {
        ...DEFAULT_TEST_CONFIG,
        features: { ...DEFAULT_TEST_CONFIG.features, db: true },
      };

      generator = new APIPackageGenerator(configWithDb, tempDir);
      await generator.generate();

      const configPath = path.join(tempDir, 'packages', 'api', 'src', 'core', 'config.py');
      await assertFileExists(configPath);
    });

    it('should generate config files with database features disabled', async () => {
      const configWithoutDb = {
        ...DEFAULT_TEST_CONFIG,
        features: { ...DEFAULT_TEST_CONFIG.features, db: false },
      };

      generator = new APIPackageGenerator(configWithoutDb, tempDir);
      await generator.generate();

      const configPath = path.join(tempDir, 'packages', 'api', 'src', 'core', 'config.py');
      await assertFileExists(configPath);
    });
  });

  describe('error handling', () => {
    it('should handle file system errors gracefully', async () => {
      // Create a generator with invalid directory
      const invalidGenerator = new APIPackageGenerator(DEFAULT_TEST_CONFIG, '/invalid/path');

      await expect(invalidGenerator.generate()).rejects.toThrow();
    });

    it('should handle permission errors', async () => {
      // Make directory read-only
      await fs.chmod(tempDir, 0o444);

      await expect(generator.generate()).rejects.toThrow();

      // Restore permissions for cleanup
      await fs.chmod(tempDir, 0o755);
    });
  });
});
