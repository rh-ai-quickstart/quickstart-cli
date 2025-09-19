/**
 * Main Project Generator
 * Orchestrates the generation of all project packages and configuration
 */
import { ProjectConfig } from '../types/features.js';
export interface GenerationStep {
    step: string;
    message: string;
    currentStep: number;
    totalSteps: number;
}
interface ProjectGeneratorOptions {
    skipDependencies?: boolean;
}
export declare class ProjectGenerator {
    private outputDir;
    private config;
    private options;
    onProgress?: (currentFile: string, completed: number, total: number) => void;
    constructor(outputDir: string, config: ProjectConfig, options?: ProjectGeneratorOptions);
    private checkPackageManagerAvailable;
    generateProject(): AsyncGenerator<GenerationStep>;
    private calculateTotalSteps;
    private installDependencies;
    private initGitRepository;
}
export {};
