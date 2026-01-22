/**
 * API Package Generator
 * Generates FastAPI/Python package
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { ProjectConfig } from '../../../types/features.js';
import {
  generatePackageJson,
  generatePyprojectToml,
  generateReadme,
  ConfigTemplateParams,
} from './templates/config/index.js';
import {
  generateInitFile,
  generateMainFile,
  SourceTemplateParams,
} from './templates/main/index.js';
import { generateConfigFile } from './templates/config/config-file.js';
import { generateHealthRoute } from './templates/routes/index.js';
import { generateHealthSchema } from './templates/schemas/index.js';
import { generateHealthTests, generateConftest, generateTestHelpers, TestTemplateParams } from './templates/tests/index.js';
import { generateContainerfile } from './templates/containerfile.js';

export class APIPackageGenerator {
  private packageDir: string;
  private templateParams: ConfigTemplateParams & SourceTemplateParams & TestTemplateParams;

  constructor(config: ProjectConfig, outputDir: string) {
    this.packageDir = path.join(outputDir, 'packages', 'api');
    this.templateParams = {
      config,
      features: config.features,
    };
  }

  async generate(): Promise<void> {
    // Directory structure must be created first as the other generators depend on it.
    await this.createDirectoryStructure();
    // After that, we can generate the files in parallel.
    await Promise.all([
      this.generateConfigFiles(),
      this.generateSourceFiles(),
      this.generateTests(),
    ]);
  }

  private async createDirectoryStructure(): Promise<void> {
    const dirs = [
      this.packageDir,
      path.join(this.packageDir, 'src'),
      path.join(this.packageDir, 'src', 'core'),
      path.join(this.packageDir, 'src', 'routes'),
      path.join(this.packageDir, 'src', 'models'),
      path.join(this.packageDir, 'src', 'schemas'),
      path.join(this.packageDir, 'tests'),
    ];

    for (const dir of dirs) {
      await fs.ensureDir(dir);
    }
  }

  private async generateConfigFiles(): Promise<void> {
    const files = {
      'README.md': generateReadme(this.templateParams),
      'package.json': generatePackageJson(this.templateParams),
      'pyproject.toml': generatePyprojectToml(this.templateParams),
      'Containerfile': generateContainerfile(this.templateParams),
    };

    for (const [filename, content] of Object.entries(files)) {
      await fs.outputFile(path.join(this.packageDir, filename), content);
    }
  }

  private async generateSourceFiles(): Promise<void> {
    const files = {
      'src/__init__.py': generateInitFile(this.templateParams),
      'src/main.py': generateMainFile(this.templateParams),
      'src/core/__init__.py': '',
      'src/core/config.py': generateConfigFile(this.templateParams),
      'src/routes/__init__.py': '',
      'src/routes/health.py': generateHealthRoute(this.templateParams),
      'src/models/__init__.py': '',
      'src/schemas/__init__.py': '',
      'src/schemas/health.py': generateHealthSchema(),
    };

    for (const [filepath, content] of Object.entries(files)) {
      await fs.outputFile(path.join(this.packageDir, filepath), content);
    }
  }

  private async generateTests(): Promise<void> {
    const testFiles = {
      'tests/__init__.py': '',
      'tests/conftest.py': generateConftest(),
      'tests/helpers.py': generateTestHelpers(),
      'tests/test_health.py': generateHealthTests(this.templateParams),
    };

    for (const [filepath, content] of Object.entries(testFiles)) {
      await fs.outputFile(path.join(this.packageDir, filepath), content);
    }
  }
}
