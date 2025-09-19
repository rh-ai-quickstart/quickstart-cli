/**
 * Database Package Generator
 * Generates PostgreSQL/Alembic package
 */
import { ProjectConfig } from '../../../types/features.js';
export declare class DBPackageGenerator {
    private packageDir;
    private templateParams;
    constructor(outputDir: string, config: ProjectConfig);
    generate(): Promise<void>;
    private createDirectoryStructure;
    private generateConfigFiles;
    private generateSourceFiles;
    private generateMigrationFiles;
    private generateTests;
}
