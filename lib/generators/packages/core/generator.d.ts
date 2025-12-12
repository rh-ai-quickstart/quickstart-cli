/**
 * Core Package Generator
 * Handles generation of root project configuration files
 */
import { ProjectConfig } from '../../../types/features.js';
export declare class CorePackageGenerator {
    private outputDir;
    private config;
    private templateParams;
    constructor(outputDir: string, config: ProjectConfig);
    generate(): Promise<void>;
    private generateRootPackageJson;
    private generateTurboConfig;
    private generatePnpmWorkspace;
    private generateReadme;
    private generateGitignore;
    private generateReleaseConfig;
    private generateCommitlint;
    private generateHuskyHooks;
    private generatePullRequestTemplate;
    private generateCompose;
    private generateMakefile;
    private generateEnvExample;
}
