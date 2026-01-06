/**
 * Database Package Generator
 * Generates PostgreSQL/Alembic package
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { ProjectConfig } from '../../../types/features.js';
import {
  generatePackageJson,
  generatePyprojectToml,
  generateAlembicConfig,
  generateReadme,
  ConfigTemplateParams,
} from './templates/config/index.js';
import {
  generateDatabaseModule,
  generateInitFile,
  SourceTemplateParams,
} from './templates/source/index.js';
import {
  generateAlembicEnv,
  generateAlembicScript,
  MigrationTemplateParams,
} from './templates/migrations/index.js';
import { generateDatabaseTests, TestTemplateParams } from './templates/tests/index.js';
import { generateContainerfile } from './templates/containerfile.js';

export class DBPackageGenerator {
  private packageDir: string;
  private templateParams: ConfigTemplateParams &
    SourceTemplateParams &
    MigrationTemplateParams &
    TestTemplateParams;

  constructor(outputDir: string, config: ProjectConfig) {
    this.packageDir = path.join(outputDir, 'packages', 'db');
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
      this.generateMigrationFiles(),
      this.generateTests(),
    ]);
  }

  private async createDirectoryStructure(): Promise<void> {
    const dirs = [
      this.packageDir,
      path.join(this.packageDir, 'src'),
      path.join(this.packageDir, 'alembic'),
      path.join(this.packageDir, 'alembic', 'versions'),
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
      'alembic.ini': generateAlembicConfig(this.templateParams),
      'Containerfile': generateContainerfile(this.templateParams),
    };

    for (const [filename, content] of Object.entries(files)) {
      await fs.outputFile(path.join(this.packageDir, filename), content);
    }
  }

  private async generateSourceFiles(): Promise<void> {
    const files = {
      'src/__init__.py': '# Empty marker file for src directory',
      'src/db/__init__.py': generateInitFile(),
      'src/db/database.py': generateDatabaseModule(this.templateParams),
    };

    for (const [filepath, content] of Object.entries(files)) {
      await fs.outputFile(path.join(this.packageDir, filepath), content);
    }
  }

  private async generateMigrationFiles(): Promise<void> {
    const files = {
      'alembic/env.py': generateAlembicEnv(),
      'alembic/script.py.mako': generateAlembicScript(),
    };

    for (const [filepath, content] of Object.entries(files)) {
      await fs.outputFile(path.join(this.packageDir, filepath), content);
    }
  }

  private async generateTests(): Promise<void> {
    const testFiles = {
      'tests/__init__.py': '',
      'tests/test_database.py': generateDatabaseTests(),
    };

    for (const [filepath, content] of Object.entries(testFiles)) {
      await fs.outputFile(path.join(this.packageDir, filepath), content);
    }
  }
}
