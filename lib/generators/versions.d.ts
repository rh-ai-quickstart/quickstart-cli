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
export declare const PACKAGE_MANAGER_VERSIONS: {
    readonly pnpm: "9.0.0";
    readonly yarn: "4.0.0";
    readonly npm: "10.0.0";
};
/**
 * Core Infrastructure Versions
 */
export declare const CORE_VERSIONS: {
    readonly turbo: "^2.0.0";
    readonly husky: "^9.1.6";
    readonly 'lint-staged': "^15.2.10";
    readonly '@commitlint/cli': "^19.4.0";
    readonly '@commitlint/config-conventional': "^19.4.0";
    readonly 'semantic-release': "^24.2.7";
};
/**
 * React & UI Framework Versions
 *
 * Compatibility Notes:
 * - React 19.2.0 is the latest stable version
 * - React 19 includes improved TypeScript support and new features
 */
export declare const REACT_VERSIONS: {
    readonly react: "^19.2.0";
    readonly 'react-dom': "^19.2.0";
    readonly '@types/react': "^19.2.0";
    readonly '@types/react-dom': "^19.2.0";
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
export declare const BUILD_VERSIONS: {
    readonly vite: "^7.2.2";
    readonly '@vitejs/plugin-react': "^5.1.1";
    readonly '@tailwindcss/vite': "^4.1.17";
    readonly typescript: "^5.9.3";
};
/**
 * Testing Framework Versions
 *
 * Compatibility Notes:
 * - Vitest 4.0.8 is compatible with Vite 7
 * - @testing-library/react 16.3.0 supports React 19
 */
export declare const TESTING_VERSIONS: {
    readonly vitest: "^4.0.8";
    readonly '@testing-library/react': "^16.3.0";
    readonly '@testing-library/jest-dom': "^6.4.2";
    readonly jsdom: "^24.0.0";
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
export declare const STORYBOOK_VERSIONS: {
    readonly storybook: "^8.6.14";
    readonly '@storybook/react': "^8.6.14";
    readonly '@storybook/react-vite': "^8.6.14";
    readonly '@storybook/types': "^8.6.14";
    readonly '@storybook/addon-essentials': "^8.6.14";
    readonly '@storybook/addon-interactions': "^8.6.14";
    readonly '@storybook/addon-links': "^8.6.14";
    readonly '@storybook/addon-onboarding': "^8.6.14";
    readonly '@storybook/blocks': "^8.6.14";
    readonly '@storybook/test': "^8.6.14";
    readonly 'storybook-dark-mode': "^4.0.2";
};
/**
 * Routing & State Management Versions
 */
export declare const ROUTING_VERSIONS: {
    readonly '@tanstack/react-router': "^1.31.24";
    readonly '@tanstack/router-devtools': "^1.31.24";
    readonly '@tanstack/router-vite-plugin': "^1.31.18";
    readonly '@tanstack/react-query': "^5.32.0";
};
/**
 * UI Component Library Versions
 */
export declare const UI_COMPONENT_VERSIONS: {
    readonly '@radix-ui/react-avatar': "^1.0.4";
    readonly '@radix-ui/react-dropdown-menu': "^2.0.6";
    readonly '@radix-ui/react-separator': "^1.0.3";
    readonly '@radix-ui/react-slot': "^1.0.2";
    readonly '@radix-ui/react-tooltip': "^1.0.7";
    readonly 'class-variance-authority': "^0.7.0";
    readonly clsx: "^2.1.1";
    readonly 'lucide-react': "^0.378.0";
    readonly 'tailwind-merge': "^2.3.0";
    readonly 'tailwindcss-animate': "^1.0.7";
};
/**
 * Styling Versions
 */
export declare const STYLING_VERSIONS: {
    readonly tailwindcss: "^4.1.17";
    readonly 'tw-animate-css': "^1.3.6";
    readonly autoprefixer: "^10.4.19";
    readonly postcss: "^8.4.38";
};
/**
 * Linting & Formatting Versions
 *
 * Compatibility Notes:
 * - ESLint 9.x uses flat config format (eslint.config.mjs)
 * - @typescript-eslint v8.x is required for ESLint 9 compatibility
 * - eslint-config-prettier v10.x supports ESLint 9
 */
export declare const LINTING_VERSIONS: {
    readonly eslint: "^9.0.0";
    readonly '@typescript-eslint/eslint-plugin': "^8.0.0";
    readonly '@typescript-eslint/parser': "^8.0.0";
    readonly 'eslint-config-prettier': "^10.0.0";
    readonly 'eslint-plugin-prettier': "^5.1.3";
    readonly 'eslint-plugin-react-hooks': "^5.0.0";
    readonly 'eslint-plugin-react-refresh': "^0.4.6";
    readonly 'eslint-plugin-tailwindcss': "^3.15.1";
    readonly prettier: "^3.2.5";
};
/**
 * Type Definitions Versions
 */
export declare const TYPES_VERSIONS: {
    readonly '@types/node': "^20.12.7";
};
/**
 * Utility Versions
 */
export declare const UTILITY_VERSIONS: {
    readonly zod: "^3.22.4";
    readonly concurrently: "^9.1.0";
};
/**
 * Python Package Versions
 *
 * Compatibility Notes:
 * - FastAPI 0.104.0+ requires Pydantic v2
 * - SQLAlchemy 2.0.0+ uses async/await patterns
 * - Python 3.11+ required for modern async features
 */
export declare const PYTHON_VERSIONS: {
    readonly fastapi: ">=0.104.0";
    readonly uvicorn: ">=0.24.0";
    readonly pydantic: ">=2.5.0";
    readonly 'pydantic-settings': ">=2.1.0";
    readonly sqlalchemy: ">=2.0.0";
    readonly alembic: ">=1.13.0";
    readonly asyncpg: ">=0.29.0";
    readonly greenlet: ">=3.2.3";
    readonly pytest: ">=7.4.0";
    readonly 'pytest-asyncio': ">=0.21.0";
    readonly httpx: ">=0.25.0";
    readonly ruff: ">=0.1.0";
    readonly mypy: ">=1.7.0";
    readonly python: ">=3.11";
};
/**
 * Combined version exports for convenience
 */
export declare const UI_VERSIONS: {
    readonly zod: "^3.22.4";
    readonly concurrently: "^9.1.0";
    readonly '@types/node': "^20.12.7";
    readonly eslint: "^9.0.0";
    readonly '@typescript-eslint/eslint-plugin': "^8.0.0";
    readonly '@typescript-eslint/parser': "^8.0.0";
    readonly 'eslint-config-prettier': "^10.0.0";
    readonly 'eslint-plugin-prettier': "^5.1.3";
    readonly 'eslint-plugin-react-hooks': "^5.0.0";
    readonly 'eslint-plugin-react-refresh': "^0.4.6";
    readonly 'eslint-plugin-tailwindcss': "^3.15.1";
    readonly prettier: "^3.2.5";
    readonly tailwindcss: "^4.1.17";
    readonly 'tw-animate-css': "^1.3.6";
    readonly autoprefixer: "^10.4.19";
    readonly postcss: "^8.4.38";
    readonly '@radix-ui/react-avatar': "^1.0.4";
    readonly '@radix-ui/react-dropdown-menu': "^2.0.6";
    readonly '@radix-ui/react-separator': "^1.0.3";
    readonly '@radix-ui/react-slot': "^1.0.2";
    readonly '@radix-ui/react-tooltip': "^1.0.7";
    readonly 'class-variance-authority': "^0.7.0";
    readonly clsx: "^2.1.1";
    readonly 'lucide-react': "^0.378.0";
    readonly 'tailwind-merge': "^2.3.0";
    readonly 'tailwindcss-animate': "^1.0.7";
    readonly '@tanstack/react-router': "^1.31.24";
    readonly '@tanstack/router-devtools': "^1.31.24";
    readonly '@tanstack/router-vite-plugin': "^1.31.18";
    readonly '@tanstack/react-query': "^5.32.0";
    readonly storybook: "^8.6.14";
    readonly '@storybook/react': "^8.6.14";
    readonly '@storybook/react-vite': "^8.6.14";
    readonly '@storybook/types': "^8.6.14";
    readonly '@storybook/addon-essentials': "^8.6.14";
    readonly '@storybook/addon-interactions': "^8.6.14";
    readonly '@storybook/addon-links': "^8.6.14";
    readonly '@storybook/addon-onboarding': "^8.6.14";
    readonly '@storybook/blocks': "^8.6.14";
    readonly '@storybook/test': "^8.6.14";
    readonly 'storybook-dark-mode': "^4.0.2";
    readonly vitest: "^4.0.8";
    readonly '@testing-library/react': "^16.3.0";
    readonly '@testing-library/jest-dom': "^6.4.2";
    readonly jsdom: "^24.0.0";
    readonly vite: "^7.2.2";
    readonly '@vitejs/plugin-react': "^5.1.1";
    readonly '@tailwindcss/vite': "^4.1.17";
    readonly typescript: "^5.9.3";
    readonly react: "^19.2.0";
    readonly 'react-dom': "^19.2.0";
    readonly '@types/react': "^19.2.0";
    readonly '@types/react-dom': "^19.2.0";
};
/**
 * Helper function to get package manager version
 */
export declare function getPackageManagerVersion(packageManager: string): string;
/**
 * Type-safe version lookup
 */
export type VersionKey = keyof typeof UI_VERSIONS | keyof typeof CORE_VERSIONS | keyof typeof PYTHON_VERSIONS;
