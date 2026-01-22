/**
 * Generator Syntax Validation Tests
 *
 * Fast tests that validate generated code syntax without installing dependencies.
 * Uses basic syntax checking and AST parsing to catch obvious errors quickly.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import { UIPackageGenerator } from '../../generators/packages/ui/generator.js';
import { APIPackageGenerator } from '../../generators/packages/api/generator.js';
import {
  createTempDir,
  cleanupTempDir,
  DEFAULT_TEST_CONFIG,
  assertFileExists,
  validateTypeScriptSyntax,
  validatePythonSyntax,
} from '../utils/test-helpers.js';

describe('Generator Syntax Validation', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('generator-syntax-test-');
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('UI Package Syntax', () => {
    it('should generate syntactically valid TypeScript files', async () => {
      const generator = new UIPackageGenerator(tempDir, DEFAULT_TEST_CONFIG);
      await generator.generate();

      const uiDir = path.join(tempDir, 'packages', 'ui');

      // All TypeScript files that should be generated
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
        'src/components/logo/logo.tsx',
        'src/components/hero/hero.tsx',
        'src/components/stat-card/stat-card.tsx',
        'src/components/status-panel/status-panel.tsx',
        'src/components/service-card/service-card.tsx',
        'src/components/service-list/service-list.tsx',
        'src/components/footer/footer.tsx',
        // removed after inlining accent glow and card accent
        'src/routes/__root.tsx',
        'src/routes/index.tsx',
        'vite.config.ts',
      ];

      // Validate each TypeScript file syntax
      for (const file of tsFiles) {
        const filePath = path.join(uiDir, file);
        await assertFileExists(filePath);

        const isValid = await validateTypeScriptSyntax(filePath);
        if (!isValid) {
          const content = await fs.readFile(filePath, 'utf-8');
          throw new Error(`Invalid TypeScript syntax in ${file}:\n${content.slice(0, 500)}...`);
        }
      }

      console.log(`✅ All ${tsFiles.length} TypeScript files have valid syntax`);
    });

    it('should generate valid JSON configuration files', async () => {
      const generator = new UIPackageGenerator(tempDir, DEFAULT_TEST_CONFIG);
      await generator.generate();

      const uiDir = path.join(tempDir, 'packages', 'ui');

      // JSON files that should be valid
      const jsonFiles = ['package.json', 'tsconfig.json', 'tsconfig.node.json'];

      for (const file of jsonFiles) {
        const filePath = path.join(uiDir, file);
        await assertFileExists(filePath);

        // Validate JSON syntax
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          JSON.parse(content);
        } catch (error) {
          throw new Error(`Invalid JSON syntax in ${file}: ${error}`);
        }
      }

      console.log(`✅ All ${jsonFiles.length} JSON files have valid syntax`);
    });

    it('should generate valid component imports and exports', async () => {
      const generator = new UIPackageGenerator(tempDir, DEFAULT_TEST_CONFIG);
      await generator.generate();

      const uiDir = path.join(tempDir, 'packages', 'ui');

      // Check that index route properly imports all UI components
      const indexRoute = path.join(uiDir, 'src', 'routes', 'index.tsx');
      const content = await fs.readFile(indexRoute, 'utf-8');

      // Validate imports exist
      const expectedImports = [
        "from '../components/hero/hero'",
        "from '../components/status-panel/status-panel'",
        "from '../components/footer/footer'",
        "from '../hooks/health'",
      ];

      for (const importStatement of expectedImports) {
        if (!content.includes(importStatement)) {
          throw new Error(`Missing expected import in index.tsx: ${importStatement}`);
        }
      }

      console.log('✅ All expected imports found in index route');
    });
  });

  describe('API Package Syntax', () => {
    it('should generate syntactically valid Python files', async () => {
      const generator = new APIPackageGenerator(DEFAULT_TEST_CONFIG, tempDir);
      await generator.generate();

      const apiDir = path.join(tempDir, 'packages', 'api');

      // All Python files that should be generated
      const pythonFiles = [
        'src/main.py',
        'src/core/config.py',
        'src/routes/health.py',
        'tests/test_health.py',
      ];

      // Validate each Python file syntax
      for (const file of pythonFiles) {
        const filePath = path.join(apiDir, file);
        await assertFileExists(filePath);

        const isValid = await validatePythonSyntax(filePath);
        if (!isValid) {
          const content = await fs.readFile(filePath, 'utf-8');
          throw new Error(`Invalid Python syntax in ${file}:\n${content.slice(0, 500)}...`);
        }
      }

      console.log(`✅ All ${pythonFiles.length} Python files have valid syntax`);
    });

    it('should generate valid TOML configuration files', async () => {
      const configWithDb = {
        ...DEFAULT_TEST_CONFIG,
        features: { ...DEFAULT_TEST_CONFIG.features, db: true },
      };
      const generator = new APIPackageGenerator(configWithDb, tempDir);
      await generator.generate();

      const apiDir = path.join(tempDir, 'packages', 'api');

      // Check pyproject.toml exists and has required sections
      const pyprojectPath = path.join(apiDir, 'pyproject.toml');
      await assertFileExists(pyprojectPath);

      const content = await fs.readFile(pyprojectPath, 'utf-8');

      // Validate required sections exist
      const requiredSections = [
        '[project]',
        '[build-system]',
        '[tool.mypy]',
        'name = ',
        'dependencies = [',
        'fastapi',
        'uvicorn',
      ];

      for (const section of requiredSections) {
        if (!content.includes(section)) {
          throw new Error(`Missing required section in pyproject.toml: ${section}`);
        }
      }

      console.log('✅ pyproject.toml has valid structure');
    });
  });

  describe('Feature-Conditional Generation', () => {
    it('should exclude API features in UI when disabled', async () => {
      const configWithoutApi = {
        ...DEFAULT_TEST_CONFIG,
        features: { ui: true, api: false, db: false },
      };
      const generator = new UIPackageGenerator(tempDir, configWithoutApi);
      await generator.generate();

      const uiDir = path.join(tempDir, 'packages', 'ui');

      // Check that services and hooks are NOT generated
      const servicesDir = path.join(uiDir, 'src', 'services');
      const hooksDir = path.join(uiDir, 'src', 'hooks');
      const servicesDirExists = await fs.pathExists(servicesDir);
      const hooksDirExists = await fs.pathExists(hooksDir);

      expect(servicesDirExists).toBe(false);
      expect(hooksDirExists).toBe(false);

      console.log('✅ API features properly excluded from UI when disabled');
    });

    it('should include database features in API when enabled', async () => {
      const configWithDb = {
        ...DEFAULT_TEST_CONFIG,
        features: { ...DEFAULT_TEST_CONFIG.features, db: true },
      };
      const generator = new APIPackageGenerator(configWithDb, tempDir);
      await generator.generate();

      const apiDir = path.join(tempDir, 'packages', 'api');

      // Check that config includes database settings
      const configPath = path.join(apiDir, 'src', 'core', 'config.py');
      const content = await fs.readFile(configPath, 'utf-8');

      if (!content.includes('DATABASE_URL')) {
        throw new Error('Database features not properly included in API config');
      }

      console.log('✅ Database features properly included in API when enabled');
    });
  });

  describe('Cross-Package Consistency', () => {
    it('should generate consistent naming in UI package', async () => {
      const testConfig = {
        ...DEFAULT_TEST_CONFIG,
        name: 'my-custom-app',
      };

      const generator = new UIPackageGenerator(tempDir, testConfig);
      await generator.generate();

      // Check UI package name
      const uiPackageJson = path.join(tempDir, 'packages', 'ui', 'package.json');
      const uiContent = JSON.parse(await fs.readFile(uiPackageJson, 'utf-8'));
      expect(uiContent.name).toBe('@my-custom-app/ui');

      // Check that UI references the correct app name
      const rootRoute = path.join(tempDir, 'packages', 'ui', 'src', 'routes', '__root.tsx');
      const rootContent = await fs.readFile(rootRoute, 'utf-8');
      if (!rootContent.includes('my-custom-app')) {
        throw new Error('UI does not reference correct app name');
      }

      console.log('✅ Consistent naming in UI package');
    });
  });
});
