/**
 * Config Packages Generator
 * Generates shared configuration packages for ESLint and Prettier
 */
import * as fs from 'fs-extra';
import * as path from 'path';
import { generateESLintPackageJson } from './templates/eslint-package-json.js';
import { generateESLintConfigCJS } from './templates/eslint-config-cjs.js';
import { generateESLintConfigMJS } from './templates/eslint-config-mjs.js';
import { generatePrettierPackageJson } from './templates/prettier-package-json.js';
import { generatePrettierConfig } from './templates/prettier-config.js';
import { generateRuffToml } from './templates/ruff-toml.js';
export class ConfigPackageGenerator {
    constructor(outputDir, config) {
        this.outputDir = outputDir;
        this.config = config;
    }
    async generate() {
        const configsDir = path.join(this.outputDir, 'packages', 'configs');
        // Create ESLint config package
        await this.generateESLintConfig(configsDir);
        // Create Prettier config package
        await this.generatePrettierConfig(configsDir);
        // Create Ruff config for Python packages (if API feature is enabled)
        if (this.config.features.api || this.config.features.db) {
            await this.generateRuffConfig(configsDir);
        }
    }
    async generateESLintConfig(configsDir) {
        const eslintDir = path.join(configsDir, 'eslint');
        // Generate package.json
        await fs.outputFile(path.join(eslintDir, 'package.json'), generateESLintPackageJson(this.config));
        // Generate index.cjs (for CommonJS compatibility)
        await fs.outputFile(path.join(eslintDir, 'index.cjs'), generateESLintConfigCJS(this.config));
        // Generate index.mjs (ESM export)
        await fs.outputFile(path.join(eslintDir, 'index.mjs'), generateESLintConfigMJS(this.config));
    }
    async generatePrettierConfig(configsDir) {
        const prettierDir = path.join(configsDir, 'prettier');
        // Generate package.json
        await fs.outputFile(path.join(prettierDir, 'package.json'), generatePrettierPackageJson(this.config));
        // Generate index.json (Prettier config)
        await fs.outputFile(path.join(prettierDir, 'index.json'), generatePrettierConfig(this.config));
    }
    async generateRuffConfig(configsDir) {
        const ruffDir = path.join(configsDir, 'ruff');
        // Generate pyproject.toml with ruff configuration
        await fs.outputFile(path.join(ruffDir, 'pyproject.toml'), generateRuffToml(this.config));
    }
}
