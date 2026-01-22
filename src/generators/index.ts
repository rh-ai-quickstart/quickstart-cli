/**
 * Main Project Generator
 * Orchestrates the generation of all project packages and configuration
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ProjectConfig } from '../types/features.js';
import { UIPackageGenerator } from './packages/ui/generator.js';
import { APIPackageGenerator } from './packages/api/generator.js';
import { DBPackageGenerator } from './packages/db/generator.js';
import { CorePackageGenerator } from './packages/core/generator.js';
import { ConfigPackageGenerator } from './packages/config/generator.js';
import { HelmPackageGenerator } from './packages/helm/generator.js';
import { AgentRulesGenerator } from './packages/agents/generator.js';

const execAsync = promisify(exec);

export interface GenerationStep {
  step: string;
  message: string;
  currentStep: number;
  totalSteps: number;
}

interface ProjectGeneratorOptions {
  skipDependencies?: boolean;
}

export class ProjectGenerator {
  public onProgress?: (currentFile: string, completed: number, total: number) => void;

  constructor(
    private outputDir: string,
    private config: ProjectConfig,
    private options: ProjectGeneratorOptions = {}
  ) {}

  private async checkPackageManagerAvailable(packageManager: string): Promise<boolean> {
    try {
      await execAsync(`which ${packageManager}`, { cwd: this.outputDir });
      return true;
    } catch {
      return false;
    }
  }

  async *generateProject(): AsyncGenerator<GenerationStep> {
    const totalSteps = this.calculateTotalSteps();
    let currentStep = 0;

    try {
      // Create project directory
      currentStep = 1;
      yield {
        step: 'foundation',
        message: 'Creating project directory...',
        currentStep,
        totalSteps,
      };
      await fs.ensureDir(this.outputDir);

      // Generate root configuration
      currentStep = 2;
      yield {
        step: 'foundation',
        message: 'Setting up project structure...',
        currentStep,
        totalSteps,
      };
      const coreGenerator = new CorePackageGenerator(this.outputDir, this.config);
      await coreGenerator.generate();

      // Generate config packages (ESLint and Prettier)
      currentStep = 3;
      yield {
        step: 'configs',
        message: 'Setting up shared configurations...',
        currentStep,
        totalSteps,
      };
      const configGenerator = new ConfigPackageGenerator(this.outputDir, this.config);
      await configGenerator.generate();

      // Generate AI agent rules
      currentStep++;
      yield {
        step: 'agents',
        message: 'Generating AI agent configuration...',
        currentStep,
        totalSteps,
      };
      const agentRulesGenerator = new AgentRulesGenerator(this.config, this.outputDir);
      await agentRulesGenerator.generate();

      // Generate UI package (if enabled)
      if (this.config.features.ui) {
        currentStep++;
        yield { step: 'ui', message: 'Setting up React frontend...', currentStep, totalSteps };
        const uiGenerator = new UIPackageGenerator(this.outputDir, this.config);
        await uiGenerator.generate();
      }

      // Generate API package (if enabled)
      if (this.config.features.api) {
        currentStep++;
        yield { step: 'api', message: 'Setting up Python API...', currentStep, totalSteps };
        const apiGenerator = new APIPackageGenerator(this.config, this.outputDir);
        await apiGenerator.generate();
      }

      // Generate DB package (if enabled)
      if (this.config.features.db) {
        currentStep++;
        yield { step: 'db', message: 'Setting up database package...', currentStep, totalSteps };
        const dbGenerator = new DBPackageGenerator(this.outputDir, this.config);
        await dbGenerator.generate();
      }

      // Generate Helm charts
      currentStep++;
      yield {
        step: 'helm',
        message: 'Generating Helm charts...',
        currentStep,
        totalSteps,
      };
      const helmGenerator = new HelmPackageGenerator(this.config, this.outputDir);
      await helmGenerator.generate();

      // Install dependencies (if not skipped)
      if (!this.options.skipDependencies) {
        currentStep++;
        yield {
          step: 'dependencies',
          message: 'Installing dependencies...',
          currentStep,
          totalSteps,
        };
        await this.installDependencies();
      }

      // Initialize git repository
      currentStep++;
      yield {
        step: 'finalize',
        message: 'Initializing Git repository...',
        currentStep,
        totalSteps,
      };
      await this.initGitRepository();

      // Final success message
      yield {
        step: 'complete',
        message: 'Project generated successfully!',
        currentStep,
        totalSteps,
      };
    } catch (error) {
      throw error;
    }
  }

  private calculateTotalSteps(): number {
    let steps = 6; // project dir + root config + config packages + agents + helm + git
    if (this.config.features.ui) steps++;
    if (this.config.features.api) steps++;
    if (this.config.features.db) steps++;
    if (!this.options.skipDependencies) steps++; // dependencies step
    return steps;
  }

  private async installDependencies(): Promise<void> {
    const packageManager = this.config.packageManager;
    const isAvailable = await this.checkPackageManagerAvailable(packageManager);

    if (!isAvailable) {
      throw new Error(
        `${packageManager} is not installed. Please install it first:\n` +
          `• pnpm: npm install -g pnpm\n` +
          `• yarn: npm install -g yarn\n` +
          `• npm: comes with Node.js`
      );
    }

    try {
      await execAsync(`${packageManager} install`, {
        cwd: this.outputDir,
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large outputs
      });
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      const stderr = error?.stderr || '';
      const stdout = error?.stdout || '';

      // Combine all error output for detection
      const allErrorOutput = `${errorMessage}\n${stderr}\n${stdout}`;

      // Check if this is an esbuild or postinstall script error that might be fixed by cleaning
      const isPostinstallError =
        allErrorOutput.includes('postinstall') ||
        allErrorOutput.includes('esbuild') ||
        allErrorOutput.includes('ELIFECYCLE') ||
        (allErrorOutput.includes('Expected') && allErrorOutput.includes('but got'));

      // Try cleaning and retrying for postinstall errors
      if (isPostinstallError) {
        try {
          // Remove node_modules
          const nodeModulesPath = path.join(this.outputDir, 'node_modules');
          if (await fs.pathExists(nodeModulesPath)) {
            await fs.remove(nodeModulesPath);
          }

          // Remove lockfiles that might cause issues
          const lockfiles = ['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock'];

          for (const lockfile of lockfiles) {
            const lockfilePath = path.join(this.outputDir, lockfile);
            if (await fs.pathExists(lockfilePath)) {
              await fs.remove(lockfilePath);
            }
          }

          // For pnpm, clean the store cache to remove corrupted binaries
          if (packageManager === 'pnpm') {
            try {
              await execAsync('pnpm store prune', {
                cwd: this.outputDir,
                maxBuffer: 10 * 1024 * 1024,
              });
            } catch {
              // Ignore store prune errors - it's not critical
            }
          }

          // Retry installation
          await execAsync(`${packageManager} install`, {
            cwd: this.outputDir,
            maxBuffer: 10 * 1024 * 1024,
          });
          return; // Success on retry
        } catch (retryError: any) {
          // If retry also fails, include both errors
          const retryStderr = retryError?.stderr || '';
          const retryStdout = retryError?.stdout || '';

          let fullError = `Failed to install dependencies with ${packageManager} (retry after cleanup also failed)`;

          if (stderr) {
            fullError += `\n\nOriginal error:\n${stderr}`;
          }

          if (retryStderr) {
            fullError += `\n\nRetry error:\n${retryStderr}`;
          }

          if (stdout && !stdout.includes('Progress:')) {
            fullError += `\n\nOriginal output:\n${stdout}`;
          }

          if (retryStdout && !retryStdout.includes('Progress:')) {
            fullError += `\n\nRetry output:\n${retryStdout}`;
          }

          throw new Error(fullError);
        }
      }

      // Build a comprehensive error message for non-retryable errors
      let fullError = `Failed to install dependencies with ${packageManager}`;

      // Always include error message
      if (errorMessage) {
        fullError += `\n\nError: ${errorMessage}`;
      }

      if (stderr) {
        fullError += `\n\nStderr:\n${stderr}`;
      }

      if (stdout) {
        // Filter out progress lines but keep important output
        const importantOutput = stdout
          .split('\n')
          .filter(
            (line: string) =>
              !line.includes('Progress:') &&
              !line.includes('Packages:') &&
              !line.includes('Scope:') &&
              line.trim().length > 0
          )
          .join('\n');

        if (importantOutput) {
          fullError += `\n\nStdout:\n${importantOutput}`;
        }
      }

      // If we have no details at all, include the raw error
      if (!stderr && !stdout && !errorMessage.includes('Failed to install')) {
        fullError += `\n\nRaw error: ${JSON.stringify(error, null, 2)}`;
      }

      throw new Error(fullError);
    }
  }

  private async initGitRepository(): Promise<void> {
    // Initialize git repository
    try {
      await execAsync('git init', { cwd: this.outputDir });
      await execAsync('git add .', { cwd: this.outputDir });
      await execAsync('git commit -m "chore: initial commit"', { cwd: this.outputDir });
    } catch (error) {
      console.warn('Could not initialize git repository:', error);
    }
  }
}
