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
