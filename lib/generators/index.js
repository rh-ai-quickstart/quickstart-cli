/**
 * Main Project Generator
 * Orchestrates the generation of all project packages and configuration
 */
import * as fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import { UIPackageGenerator } from './packages/ui/generator.js';
import { APIPackageGenerator } from './packages/api/generator.js';
import { DBPackageGenerator } from './packages/db/generator.js';
import { CorePackageGenerator } from './packages/core/generator.js';
import { ConfigPackageGenerator } from './packages/config/generator.js';
const execAsync = promisify(exec);
export class ProjectGenerator {
    constructor(outputDir, config, options = {}) {
        this.outputDir = outputDir;
        this.config = config;
        this.options = options;
    }
    async checkPackageManagerAvailable(packageManager) {
        try {
            await execAsync(`which ${packageManager}`, { cwd: this.outputDir });
            return true;
        }
        catch {
            return false;
        }
    }
    async *generateProject() {
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
        }
        catch (error) {
            throw error;
        }
    }
    calculateTotalSteps() {
        let steps = 4; // project dir + root config + config packages + git
        if (this.config.features.ui)
            steps++;
        if (this.config.features.api)
            steps++;
        if (this.config.features.db)
            steps++;
        if (!this.options.skipDependencies)
            steps++; // dependencies step
        return steps;
    }
    async installDependencies() {
        const packageManager = this.config.packageManager;
        const isAvailable = await this.checkPackageManagerAvailable(packageManager);
        if (!isAvailable) {
            throw new Error(`${packageManager} is not installed. Please install it first:\n` +
                `• pnpm: npm install -g pnpm\n` +
                `• yarn: npm install -g yarn\n` +
                `• npm: comes with Node.js`);
        }
        try {
            await execAsync(`${packageManager} install`, { cwd: this.outputDir });
        }
        catch (error) {
            throw new Error(`Failed to install dependencies with ${packageManager}: ${error}`);
        }
    }
    async initGitRepository() {
        // Initialize git repository
        try {
            await execAsync('git init', { cwd: this.outputDir });
            await execAsync('git add .', { cwd: this.outputDir });
            await execAsync('git commit -m "Initial commit"', { cwd: this.outputDir });
        }
        catch (error) {
            console.warn('Could not initialize git repository:', error);
        }
    }
}
