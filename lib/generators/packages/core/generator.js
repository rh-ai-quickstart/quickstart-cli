/**
 * Core Package Generator
 * Handles generation of root project configuration files
 */
import * as fs from 'fs-extra';
import * as path from 'path';
import { generateRootPackageJson, generateTurboJson, generatePnpmWorkspace, generateRootReadme, generateGitignore, generateReleaseRc, generateCommitlintConfig, generateHuskyPreCommitHook, generateHuskyCommitMsgHook, generatePullRequestTemplate, generateCompose, generateMakefile, generateEnvExample, } from './templates/config/index.js';
export class CorePackageGenerator {
    constructor(outputDir, config) {
        this.outputDir = outputDir;
        this.config = config;
        this.templateParams = { config };
    }
    async generate() {
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
    async generateRootPackageJson() {
        const content = generateRootPackageJson(this.templateParams);
        await fs.outputFile(path.join(this.outputDir, 'package.json'), content);
    }
    async generateTurboConfig() {
        const content = generateTurboJson(this.templateParams);
        await fs.outputFile(path.join(this.outputDir, 'turbo.json'), content);
    }
    async generatePnpmWorkspace() {
        const content = generatePnpmWorkspace(this.templateParams);
        await fs.outputFile(path.join(this.outputDir, 'pnpm-workspace.yaml'), content);
    }
    async generateReadme() {
        const content = generateRootReadme(this.templateParams);
        await fs.outputFile(path.join(this.outputDir, 'README.md'), content);
    }
    async generateGitignore() {
        const content = generateGitignore(this.templateParams);
        await fs.outputFile(path.join(this.outputDir, '.gitignore'), content);
    }
    async generateReleaseConfig() {
        const content = generateReleaseRc(this.templateParams);
        await fs.outputFile(path.join(this.outputDir, '.releaserc'), content);
    }
    async generateCommitlint() {
        const content = generateCommitlintConfig(this.templateParams);
        await fs.outputFile(path.join(this.outputDir, 'commitlint.config.js'), content);
    }
    async generateHuskyHooks() {
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
    async generatePullRequestTemplate() {
        const prContent = generatePullRequestTemplate(this.templateParams);
        const prPath = path.join(this.outputDir, '.github', 'pull_request_template.md');
        await fs.outputFile(prPath, prContent);
    }
    async generateCompose() {
        const content = generateCompose(this.templateParams);
        // Only generate compose.yml if there are containerized services
        if (content) {
            await fs.outputFile(path.join(this.outputDir, 'compose.yml'), content);
        }
    }
    async generateMakefile() {
        const content = generateMakefile(this.templateParams);
        await fs.outputFile(path.join(this.outputDir, 'Makefile'), content);
    }
    async generateEnvExample() {
        const content = generateEnvExample(this.templateParams);
        await fs.outputFile(path.join(this.outputDir, '.env.example'), content);
    }
}
