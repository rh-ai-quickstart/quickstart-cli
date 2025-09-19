export interface Feature {
    id: string;
    name: string;
    description: string;
    defaultEnabled: boolean;
    dependencies?: string[];
    files: string[];
}
export interface FeatureCategory {
    name: string;
    features: Feature[];
}
export type PackageManager = 'pnpm' | 'yarn' | 'npm';
export interface ProjectConfig {
    name: string;
    description?: string;
    packageManager: PackageManager;
    features: Record<string, boolean>;
}
export declare const PACKAGES: Feature[];
