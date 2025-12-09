import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    target: 'node18',
    lib: {
      entry: resolve(__dirname, 'src/quickstart-cli.tsx'),
      name: 'cli',
      fileName: 'quickstart-cli',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        // Node.js built-ins
        'fs', 'path', 'child_process', 'os', 'url', 'util',
        // External dependencies that should not be bundled
        'react', 'ink', 'fs-extra', 'zod'
      ],
      output: {
        banner: '#!/usr/bin/env node',
      }
    },
    outDir: 'lib'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});