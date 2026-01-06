import { z } from 'zod';
// Available packages for user selection
export const PACKAGES = [
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
// Helper to get all package IDs as a tuple for zod enum
const getPackageIds = () => PACKAGES.map((pkg) => pkg.id);
// Zod enum for package IDs - derived from PACKAGES
export const PackageIdEnum = () => {
    const ids = getPackageIds();
    return z.enum(ids);
};
