/**
 * Helm Package Generator
 * Generates Helm charts for Kubernetes/OpenShift deployment
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { ProjectConfig } from '../../../types/features.js';
import { ConfigTemplateParams } from '../../../types/config.js';

import {
  generateChartYaml,
  generateValuesYaml,
  generateHelpersTpl,
  generateDeploymentApi,
  generateDeploymentUi,
  generateServiceApi,
  generateServiceUi,
  generateRoutes,
  generateSecret,
  generateServiceAccount,
  generateMigrationJob,
  generateHelmignore,
} from './templates/index.js';

export class HelmPackageGenerator {
  private helmDir: string;
  private templatesDir: string;
  private templateParams: ConfigTemplateParams;


  constructor(config: ProjectConfig, outputDir: string) {
    this.helmDir = path.join(outputDir, 'deploy', 'helm', config.name);
    this.templatesDir = path.join(this.helmDir, 'templates');
    this.templateParams = {
      config,
      features: config.features,
    };
  }

  async generate(): Promise<void> {
    // Create directory structure
    await this.createDirectoryStructure();

    // Generate chart files
    await Promise.all([
      this.generateChartFiles(),
      this.generateTemplateFiles(),
    ]);
  }

  private async createDirectoryStructure(): Promise<void> {
    await fs.ensureDir(this.helmDir);
    await fs.ensureDir(this.templatesDir);
  }

  private async generateChartFiles(): Promise<void> {
    const files = {
      'Chart.yaml': generateChartYaml(this.templateParams),
      'values.yaml': generateValuesYaml(this.templateParams),
      '.helmignore': generateHelmignore(this.templateParams),
    };

    for (const [filename, content] of Object.entries(files)) {
      await fs.outputFile(path.join(this.helmDir, filename), content);
    }
  }

  private async generateTemplateFiles(): Promise<void> {
    const { features } = this.templateParams;
    const files: Record<string, string> = {
      '_helpers.tpl': generateHelpersTpl(this.templateParams),
      'secret.yaml': generateSecret(this.templateParams),
      'serviceaccount.yaml': generateServiceAccount(this.templateParams),
    };

    // Generate routes if api or ui is enabled
    if (features.api || features.ui) {
      files['routes.yaml'] = generateRoutes(this.templateParams);
    }

    // Generate API resources if enabled
    if (features.api) {
      files['api-deployment.yaml'] = generateDeploymentApi(this.templateParams);
      files['api-service.yaml'] = generateServiceApi(this.templateParams);
    }

    // Generate UI resources if enabled
    if (features.ui) {
      files['ui-deployment.yaml'] = generateDeploymentUi(this.templateParams);
      files['ui-service.yaml'] = generateServiceUi(this.templateParams);
    }

    // Generate DB resources if enabled
    // Note: Database deployment is handled by pgvector subchart (see Chart.yaml dependencies)
    // We only generate the migration job here
    if (features.db) {
      files['migration-job.yaml'] = generateMigrationJob(this.templateParams);
    }

    for (const [filename, content] of Object.entries(files)) {
      await fs.outputFile(path.join(this.templatesDir, filename), content);
    }
  }
}
