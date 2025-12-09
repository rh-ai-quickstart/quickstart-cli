/**
 * Core Package Generator
 * Handles generation of root project configuration files
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { ProjectConfig } from '../../../types/features.js';
import {
  generateRootPackageJson,
  generateTurboJson,
  generatePnpmWorkspace,
  generateRootReadme,
  generateGitignore,
  ConfigTemplateParams,
  generateReleaseRc,
  generateCommitlintConfig,
  generateHuskyPreCommitHook,
  generateHuskyCommitMsgHook,
  generatePullRequestTemplate,
  generateCompose,
  generateMakefile,
  generateEnvExample,
} from './templates/config/index.js';

export class CorePackageGenerator {
  private templateParams: ConfigTemplateParams;

  constructor(private outputDir: string, private config: ProjectConfig) {
    this.templateParams = { config };
  }

  async generate(): Promise<void> {
    await this.generateRootPackageJson();
    await this.generateTurboConfig();
    await this.generatePnpmWorkspace();
    await this.generateReadme();
    await this.generateGitignore();
    await this.generateReleaseConfig();
    await this.generateCommitlint();
    await this.generateHuskyHooks();
    await this.generatePullRequestTemplate();
    await this.generateCompose();
    await this.generateMakefile();
    await this.generateEnvExample();
  }

  private async generateRootPackageJson(): Promise<void> {
    const content = generateRootPackageJson(this.templateParams);
    await fs.outputFile(path.join(this.outputDir, 'package.json'), content);
  }

  private async generateTurboConfig(): Promise<void> {
    const content = generateTurboJson(this.templateParams);
    await fs.outputFile(path.join(this.outputDir, 'turbo.json'), content);
  }

  private async generatePnpmWorkspace(): Promise<void> {
    const content = generatePnpmWorkspace(this.templateParams);
    await fs.outputFile(path.join(this.outputDir, 'pnpm-workspace.yaml'), content);
  }

  private async generateReadme(): Promise<void> {
    const content = generateRootReadme(this.templateParams);
    await fs.outputFile(path.join(this.outputDir, 'README.md'), content);
  }

  private async generateGitignore(): Promise<void> {
    const content = generateGitignore(this.templateParams);
    await fs.outputFile(path.join(this.outputDir, '.gitignore'), content);
  }

  private async generateReleaseConfig(): Promise<void> {
    const content = generateReleaseRc(this.templateParams);
    await fs.outputFile(path.join(this.outputDir, '.releaserc'), content);
  }

  private async generateCommitlint(): Promise<void> {
    const content = generateCommitlintConfig(this.templateParams);
    await fs.outputFile(path.join(this.outputDir, 'commitlint.config.js'), content);
  }

  private async generateHuskyHooks(): Promise<void> {
    // Create .husky directory with hooks
    const huskyDir = path.join(this.outputDir, '.husky');
    await fs.ensureDir(huskyDir);

    // Create husky hooks
    const preCommit = generateHuskyPreCommitHook(this.templateParams);
    const commitMsg = generateHuskyCommitMsgHook(this.templateParams);

    // Write hook files with executable permissions
    await fs.outputFile(path.join(huskyDir, 'pre-commit'), preCommit, { mode: 0o755 });
    await fs.outputFile(path.join(huskyDir, 'commit-msg'), commitMsg, { mode: 0o755 });
  }

  private async generatePullRequestTemplate(): Promise<void> {
    const prContent = generatePullRequestTemplate(this.templateParams);
    const prPath = path.join(this.outputDir, '.github', 'pull_request_template.md');
    await fs.outputFile(prPath, prContent);
  }

  private async generateCompose(): Promise<void> {
    const content = generateCompose(this.templateParams);
    // Only generate compose.yml if there are containerized services
    if (content) {
      await fs.outputFile(path.join(this.outputDir, 'compose.yml'), content);
    }
  }

  private async generateMakefile(): Promise<void> {
    const content = generateMakefile(this.templateParams);
    await fs.outputFile(path.join(this.outputDir, 'Makefile'), content);
  }

  private async generateEnvExample(): Promise<void> {
    const content = generateEnvExample(this.templateParams);
    await fs.outputFile(path.join(this.outputDir, '.env.example'), content);
  }
}
