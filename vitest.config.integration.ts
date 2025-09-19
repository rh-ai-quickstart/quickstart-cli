/**
 * Vitest configuration for integration tests
 * These tests actually generate projects and test them with real toolchains
 */
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: ['./tsconfig.json'],
      ignoreConfigErrors: true,
    }),
  ],
  test: {
    // Only run integration tests
    include: ['src/__tests__/integration/**/*.test.ts'],
    exclude: ['node_modules', 'lib', 'my-kickstart'],

    // Environment
    environment: 'happy-dom',

    // Setup
    setupFiles: ['src/__tests__/setup.ts'],

    // Longer timeouts for real builds
    testTimeout: 300000, // 5 minutes
    hookTimeout: 60000, // 1 minute for setup/teardown

    // Sequential execution to avoid resource conflicts
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },

    // Don't run in watch mode by default
    watch: false,
  },
});
