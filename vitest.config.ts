/**
 * Vitest configuration for CLI testing
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
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  test: {
    // Test file patterns
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'lib', 'my-kickstart'],

    // Environment - use happy-dom to leverage Vite's module resolver
    environment: 'happy-dom',

    // Setup
    setupFiles: ['src/__tests__/setup.ts'],

    // Use Vite's resolver for dependencies
    server: {
      deps: {
        // Process these through Vite instead of Node.js directly
        inline: [/.*\.ts$/, /.*\.tsx$/],
      },
    },

    // Coverage
    coverage: {
      provider: 'v8',
      include: ['src/generators/**/*', 'src/utils/**/*'],
      exclude: ['src/**/*.d.ts', 'src/**/__tests__/**'],
      reporter: ['text', 'html', 'json'],
    },

    // Timeout for file system operations
    testTimeout: 30000,

    // Mock configuration
    mockReset: true,
  },
});
