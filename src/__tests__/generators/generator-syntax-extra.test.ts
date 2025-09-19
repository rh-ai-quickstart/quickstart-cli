import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import { UIPackageGenerator } from '../../generators/packages/ui/generator.js';
import {
  createTempDir,
  cleanupTempDir,
  DEFAULT_TEST_CONFIG,
  assertFileExists,
  validateTypeScriptSyntax,
} from '../utils/test-helpers.js';

describe('Generator Syntax Validation Extras', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir('generator-syntax-test-');
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should generate syntactically valid hooks and services', async () => {
    const generator = new UIPackageGenerator(tempDir, DEFAULT_TEST_CONFIG);
    await generator.generate();

    const uiDir = path.join(tempDir, 'packages', 'ui');

    const tsFiles = [
      'src/services/health.ts',
      'src/hooks/health.ts',
    ];

    for (const file of tsFiles) {
      const filePath = path.join(uiDir, file);
      await assertFileExists(filePath);

      const isValid = await validateTypeScriptSyntax(filePath);
      if (!isValid) {
        const content = await fs.readFile(filePath, 'utf-8');
        throw new Error(`Invalid TypeScript syntax in ${file}:\n${content.slice(0, 500)}...`);
      }
    }

    console.log(`✅ All ${tsFiles.length} hooks and services have valid syntax`);
  });
});