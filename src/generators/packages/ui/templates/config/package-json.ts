import { ConfigTemplateParams } from '.';
import {
  UI_VERSIONS,
  TESTING_VERSIONS,
  STORYBOOK_VERSIONS,
  ROUTING_VERSIONS,
  UI_COMPONENT_VERSIONS,
  UTILITY_VERSIONS,
} from '../../../../versions.js';

export const generatePackageJson = (params: ConfigTemplateParams): string => {
  const { config } = params;
  const devDependencies: Record<string, string> = {
    [`@${config.name}/eslint-config`]: 'workspace:*',
    [`@${config.name}/prettier-config`]: 'workspace:*',
    ...TESTING_VERSIONS,
    ...STORYBOOK_VERSIONS,
    ...UI_VERSIONS,
  };

  const dependencies: Record<string, string> = {
    ...ROUTING_VERSIONS,
    ...UI_COMPONENT_VERSIONS,
  };

  // Add zod for schema validation when API features are enabled
  if (config.features.api) {
    dependencies.zod = UTILITY_VERSIONS.zod;
  }

  return JSON.stringify(
    {
      name: `@${config.name}/ui`,
      private: true,
      version: '0.0.0',
      type: 'module',
      prettier: `@${config.name}/prettier-config`,
      scripts: {
        'dev:vite': 'vite',
        'dev:storybook': 'storybook dev -p 6006 --no-open',
        dev: 'concurrently "npm run dev:vite" "npm run dev:storybook"',
        'build:vite': 'tsc && vite build',
        'build:storybook': 'storybook build',
        build: 'concurrently "npm run build:vite" "npm run build:storybook"',
        lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
        preview: 'vite preview',
        'type-check': 'tsc --noEmit',
        test: 'vitest',
        'lint:fix': 'eslint . --ext .js,.jsx,.ts,.tsx --fix',
        format: 'prettier --write .',
        'format:check': 'prettier --check .',
      },
      dependencies,
      devDependencies,
    },
    null,
    2
  );
};
