/**
 * Agent Rules Generator
 * Generates AI agent configuration files for Claude Code and Cursor
 */
import { ProjectConfig } from '../../../types/features.js';
export interface AgentTemplateParams {
    config: ProjectConfig;
    features: ProjectConfig['features'];
}
export declare class AgentRulesGenerator {
    private projectDir;
    private templateParams;
    constructor(config: ProjectConfig, outputDir: string);
    generate(): Promise<void>;
    private createDirectoryStructure;
    private generateClaudeRules;
    private generateCursorRules;
}
