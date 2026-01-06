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
import { z } from 'zod';
export declare const PACKAGES: Feature[];
export type PackageId = (typeof PACKAGES)[number]['id'];
export declare const PackageIdEnum: () => z.ZodEnum<[string, ...string[]]>;
export interface ProjectConfig {
    name: string;
    description?: string;
    packageManager: PackageManager;
    features: Record<string, boolean>;
}
