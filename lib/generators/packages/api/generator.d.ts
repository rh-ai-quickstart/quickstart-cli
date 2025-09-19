/**
 * API Package Generator
 * Generates FastAPI/Python package
 */
import { ProjectConfig } from '../../../types/features.js';
export declare class APIPackageGenerator {
    private packageDir;
    private templateParams;
    constructor(config: ProjectConfig, outputDir: string);
    generate(): Promise<void>;
    private createDirectoryStructure;
    private generateConfigFiles;
    private generateSourceFiles;
    private generateTests;
}
