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

// Available packages for user selection
export const PACKAGES: Feature[] = [
  {
    id: 'api',
    name: 'API Backend',
    description: 'FastAPI backend with Python',
    defaultEnabled: true,
    files: ['packages/api/**/*'],
  },
  {
    id: 'ui',
    name: 'UI Package',
    description: 'React UI components with Vite and TypeScript',
    defaultEnabled: true,
    files: ['packages/ui/**/*'],
  },
  {
    id: 'db',
    name: 'Database',
    description: 'PostgreSQL database with migrations',
    defaultEnabled: true,
    files: ['packages/db/**/*', 'docker/postgres/**/*'],
  },
];

// Package ID type - union of all package IDs
export type PackageId = (typeof PACKAGES)[number]['id'];

// Helper to get all package IDs as a tuple for zod enum
const getPackageIds = () => PACKAGES.map((pkg) => pkg.id) as [PackageId, ...PackageId[]];

// Zod enum for package IDs - derived from PACKAGES
export const PackageIdEnum = () => {
  const ids = getPackageIds();
  return z.enum(ids);
};

export interface ProjectConfig {
  name: string;
  description?: string;
  packageManager: PackageManager;
  features: Record<string, boolean>;
}
