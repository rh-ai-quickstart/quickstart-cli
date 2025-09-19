/**
 * UI Package Generator
 * Generates React/Vite/TanStack Router package
 */
import { ProjectConfig } from '../../../types/features.js';
export declare class UIPackageGenerator {
    private outputDir;
    private config;
    private packageDir;
    private templateParams;
    constructor(outputDir: string, config: ProjectConfig);
    generate(): Promise<void>;
    private createDirectoryStructure;
    private generateConfigFiles;
    private generateSourceFiles;
    private generateComponents;
    private generateRoutes;
    private generateStyles;
    private generateStorybook;
    private generateSchemas;
    private generateServices;
    private generateHooks;
    private generateReadme;
}
