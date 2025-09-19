/**
 * Config Packages Generator
 * Generates shared configuration packages for ESLint and Prettier
 */
import { ProjectConfig } from '../../../types/features.js';
export declare class ConfigPackageGenerator {
    private outputDir;
    private config;
    constructor(outputDir: string, config: ProjectConfig);
    generate(): Promise<void>;
    private generateESLintConfig;
    private generatePrettierConfig;
    private generateRuffConfig;
}
