import { ProjectConfig } from '../types/features.js';
interface ProjectGenerationProps {
    config: ProjectConfig;
    outputDir: string;
    skipDependencies?: boolean;
    onComplete: (outputPath: string) => void;
    onError: (error: string) => void;
}
export declare function ProjectGenerationSimple({ config, outputDir, skipDependencies, onComplete, onError, }: ProjectGenerationProps): import("react/jsx-runtime").JSX.Element;
export {};
