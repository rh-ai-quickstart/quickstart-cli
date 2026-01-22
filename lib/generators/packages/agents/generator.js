/**
 * Agent Rules Generator
 * Generates AI agent configuration files for Claude Code and Cursor
 */
import * as fs from 'fs-extra';
import * as path from 'path';
import { generateClaudeArchitecture, generateClaudeUI, generateClaudeAPI, generateClaudeDatabase, generateClaudeTesting, generateClaudeCodeStyle, generateClaudeGit, } from './templates/claude/index.js';
import { generateCursorArchitecture, generateCursorUI, generateCursorAPI, generateCursorDatabase, generateCursorTesting, generateCursorCodeStyle, generateCursorGit, } from './templates/cursor/index.js';
export class AgentRulesGenerator {
    constructor(config, outputDir) {
        this.projectDir = outputDir;
        this.templateParams = {
            config,
            features: config.features,
        };
    }
    async generate() {
        await this.createDirectoryStructure();
        await Promise.all([
            this.generateClaudeRules(),
            this.generateCursorRules(),
        ]);
    }
    async createDirectoryStructure() {
        const dirs = [
            path.join(this.projectDir, '.claude', 'rules'),
            path.join(this.projectDir, '.cursor', 'rules'),
        ];
        for (const dir of dirs) {
            await fs.ensureDir(dir);
        }
    }
    async generateClaudeRules() {
        const rulesDir = path.join(this.projectDir, '.claude', 'rules');
        const { features } = this.templateParams;
        // Always generated rules
        const files = {
            'architecture.md': generateClaudeArchitecture(this.templateParams),
            'code-style.md': generateClaudeCodeStyle(this.templateParams),
            'git.md': generateClaudeGit(this.templateParams),
            'testing.md': generateClaudeTesting(this.templateParams),
        };
        // Conditionally generated rules
        if (features.ui) {
            files['ui.md'] = generateClaudeUI(this.templateParams);
        }
        if (features.api) {
            files['api.md'] = generateClaudeAPI(this.templateParams);
        }
        if (features.db) {
            files['database.md'] = generateClaudeDatabase(this.templateParams);
        }
        for (const [filename, content] of Object.entries(files)) {
            await fs.outputFile(path.join(rulesDir, filename), content);
        }
    }
    async generateCursorRules() {
        const rulesDir = path.join(this.projectDir, '.cursor', 'rules');
        const { features } = this.templateParams;
        // Always generated rules
        const files = {
            'architecture.mdc': generateCursorArchitecture(this.templateParams),
            'code-style.md': generateCursorCodeStyle(this.templateParams),
            'git-workflow.md': generateCursorGit(this.templateParams),
            'testing.mdc': generateCursorTesting(this.templateParams),
        };
        // Conditionally generated rules
        if (features.ui) {
            files['ui-development.mdc'] = generateCursorUI(this.templateParams);
        }
        if (features.api) {
            files['api-development.mdc'] = generateCursorAPI(this.templateParams);
        }
        if (features.db) {
            files['database.mdc'] = generateCursorDatabase(this.templateParams);
        }
        for (const [filename, content] of Object.entries(files)) {
            await fs.outputFile(path.join(rulesDir, filename), content);
        }
    }
}
