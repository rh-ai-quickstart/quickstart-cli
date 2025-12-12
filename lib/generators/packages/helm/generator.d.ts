/**
 * Helm Package Generator
 * Generates Helm charts for Kubernetes/OpenShift deployment
 */
import { ProjectConfig } from '../../../types/features.js';
export declare class HelmPackageGenerator {
    private helmDir;
    private templatesDir;
    private templateParams;
    constructor(config: ProjectConfig, outputDir: string);
    generate(): Promise<void>;
    private createDirectoryStructure;
    private generateChartFiles;
    private generateTemplateFiles;
}
