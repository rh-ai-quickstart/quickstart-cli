/**
 * Centralized Package Version Management
 *
 * This file contains all package versions used in generated projects.
 * Update versions here to propagate changes across all templates.
 *
 * Version Strategy:
 * - Use exact versions (e.g., '0.25.12') for critical dependencies to avoid conflicts
 * - Use caret ranges (e.g., '^5.2.0') for most dependencies to allow patch/minor updates
 * - Document compatibility requirements and known conflicts
 */
/**
 * Package Manager Versions
 */
export const PACKAGE_MANAGER_VERSIONS = {
    pnpm: '9.0.0',
    yarn: '4.0.0',
    npm: '10.0.0',
};
/**
 * Core Infrastructure Versions
 */
export const CORE_VERSIONS = {
    // Monorepo tooling
    turbo: '^2.0.0',
    // Git hooks and linting
    husky: '^9.1.6',
    'lint-staged': '^15.2.10',
    '@commitlint/cli': '^19.4.0',
    '@commitlint/config-conventional': '^19.4.0',
    // Release management
    'semantic-release': '^24.2.7',
};
/**
 * React & UI Framework Versions
 *
 * Compatibility Notes:
 * - React 19.2.0 is the latest stable version
 * - React 19 includes improved TypeScript support and new features
 */
export const REACT_VERSIONS = {
    react: '^19.2.0',
    'react-dom': '^19.2.0',
    '@types/react': '^19.2.0',
    '@types/react-dom': '^19.2.0',
};
/**
 * Build Tool Versions
 *
 * Compatibility Notes:
 * - Vite 7.2.2 is the latest version with improved performance
 * - Storybook 8.6.14 is compatible with Vite 7
 * - esbuild version is managed by Vite and Storybook automatically
 * - No need to pin esbuild with latest versions
 */
export const BUILD_VERSIONS = {
    vite: '^7.2.2',
    '@vitejs/plugin-react': '^5.1.1',
    '@tailwindcss/vite': '^4.1.17',
    typescript: '^5.9.3',
};
/**
 * Testing Framework Versions
 *
 * Compatibility Notes:
 * - Vitest 4.0.8 is compatible with Vite 7
 * - @testing-library/react 16.3.0 supports React 19
 */
export const TESTING_VERSIONS = {
    vitest: '^4.0.8',
    '@testing-library/react': '^16.3.0',
    '@testing-library/jest-dom': '^6.4.2',
    jsdom: '^24.0.0',
};
/**
 * Storybook Versions
 *
 * Compatibility Notes:
 * - Storybook 8.6.14 is the latest stable version with full ecosystem support
 * - Storybook 10.0.7 exists but addon packages haven't been released for it yet, causing incompatibilities
 * - Storybook 8.6.14 is compatible with Vite 7 and React 19
 * - All packages at 8.6.14 work together without version mismatches
 * - Config templates use ESM syntax which is compatible with Storybook 8.6.14+
 * - esbuild version is automatically managed
 * - Note: Storybook 10.0.7 upgrade will be possible once addon ecosystem catches up
 */
export const STORYBOOK_VERSIONS = {
    storybook: '^8.6.14',
    '@storybook/react': '^8.6.14',
    '@storybook/react-vite': '^8.6.14',
    '@storybook/types': '^8.6.14',
    '@storybook/addon-essentials': '^8.6.14',
    '@storybook/addon-interactions': '^8.6.14',
    '@storybook/addon-links': '^8.6.14',
    '@storybook/addon-onboarding': '^8.6.14',
    '@storybook/blocks': '^8.6.14',
    '@storybook/test': '^8.6.14',
    'storybook-dark-mode': '^4.0.2',
};
/**
 * Routing & State Management Versions
 */
export const ROUTING_VERSIONS = {
    '@tanstack/react-router': '^1.31.24',
    '@tanstack/router-devtools': '^1.31.24',
    '@tanstack/router-vite-plugin': '^1.31.18',
    '@tanstack/react-query': '^5.32.0',
};
/**
 * UI Component Library Versions
 */
export const UI_COMPONENT_VERSIONS = {
    '@radix-ui/react-avatar': '^1.0.4',
    '@radix-ui/react-dropdown-menu': '^2.0.6',
    '@radix-ui/react-separator': '^1.0.3',
    '@radix-ui/react-slot': '^1.0.2',
    '@radix-ui/react-tooltip': '^1.0.7',
    'class-variance-authority': '^0.7.0',
    clsx: '^2.1.1',
    'lucide-react': '^0.378.0',
    'tailwind-merge': '^2.3.0',
    'tailwindcss-animate': '^1.0.7',
};
/**
 * Styling Versions
 */
export const STYLING_VERSIONS = {
    tailwindcss: '^4.1.17',
    'tw-animate-css': '^1.3.6',
    autoprefixer: '^10.4.19',
    postcss: '^8.4.38',
};
/**
 * Linting & Formatting Versions
 *
 * Compatibility Notes:
 * - ESLint 9.x uses flat config format (eslint.config.mjs)
 * - @typescript-eslint v8.x is required for ESLint 9 compatibility
 * - eslint-config-prettier v10.x supports ESLint 9
 */
export const LINTING_VERSIONS = {
    eslint: '^9.0.0',
    '@typescript-eslint/eslint-plugin': '^8.0.0',
    '@typescript-eslint/parser': '^8.0.0',
    'eslint-config-prettier': '^10.0.0',
    'eslint-plugin-prettier': '^5.1.3',
    'eslint-plugin-react-hooks': '^5.0.0',
    'eslint-plugin-react-refresh': '^0.4.6',
    'eslint-plugin-tailwindcss': '^3.15.1',
    prettier: '^3.2.5',
};
/**
 * Type Definitions Versions
 */
export const TYPES_VERSIONS = {
    '@types/node': '^20.12.7',
};
/**
 * Utility Versions
 */
export const UTILITY_VERSIONS = {
    zod: '^3.22.4',
    concurrently: '^9.1.0',
};
/**
 * Python Package Versions
 *
 * Compatibility Notes:
 * - FastAPI 0.104.0+ requires Pydantic v2
 * - SQLAlchemy 2.0.0+ uses async/await patterns
 * - Python 3.11+ required for modern async features
 */
export const PYTHON_VERSIONS = {
    // Runtime
    fastapi: '>=0.104.0',
    uvicorn: '>=0.24.0',
    pydantic: '>=2.5.0',
    'pydantic-settings': '>=2.1.0',
    // Database (when db feature is enabled)
    sqlalchemy: '>=2.0.0',
    alembic: '>=1.13.0',
    asyncpg: '>=0.29.0',
    greenlet: '>=3.2.3',
    // Development
    pytest: '>=7.4.0',
    'pytest-asyncio': '>=0.21.0',
    httpx: '>=0.25.0',
    ruff: '>=0.1.0',
    mypy: '>=1.7.0',
    // Python version requirement
    python: '>=3.11',
};
/**
 * Combined version exports for convenience
 */
export const UI_VERSIONS = {
    ...REACT_VERSIONS,
    ...BUILD_VERSIONS,
    ...TESTING_VERSIONS,
    ...STORYBOOK_VERSIONS,
    ...ROUTING_VERSIONS,
    ...UI_COMPONENT_VERSIONS,
    ...STYLING_VERSIONS,
    ...LINTING_VERSIONS,
    ...TYPES_VERSIONS,
    ...UTILITY_VERSIONS,
};
/**
 * Helper function to get package manager version
 */
export function getPackageManagerVersion(packageManager) {
    return PACKAGE_MANAGER_VERSIONS[packageManager] || '1.0.0';
}
