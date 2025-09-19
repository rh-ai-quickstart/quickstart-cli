import { ConfigTemplateParams } from './index.js';

export const generateRootPackageJson = (params: ConfigTemplateParams): string => {
  const { config } = params;

  const enabledFeatures = Object.entries(config.features)
    .filter(([_, enabled]) => enabled)
    .map(([featureId, _]) => featureId);

  const getPackageManagerVersion = (packageManager: string): string => {
    switch (packageManager) {
      case 'pnpm':
        return '9.0.0';
      case 'yarn':
        return '4.0.0';
      case 'npm':
        return '10.0.0';
      default:
        return '1.0.0';
    }
  };

  const packageJson = {
    name: config.name,
    version: '0.1.0',
    description:
      config.description || `A full-stack application built with modern tools and best practices.`,
    private: true,
    workspaces: ['packages/*'],
    scripts: {
      postinstall: 'husky',
      setup: 'pnpm install && pnpm -r --if-present install:deps',
      build: 'turbo build',
      dev: 'turbo dev',
      ...(enabledFeatures.includes('db') && {
        'db:start': 'pnpm --filter @*/db db:start',
        'db:stop': 'pnpm --filter @*/db db:stop',
        'db:upgrade': 'pnpm --filter @*/db upgrade',
        'db:revision': 'pnpm --filter @*/db revision',
      }),
      lint: 'turbo lint',
      'lint:fix': 'turbo lint:fix',
      format: 'turbo format',
      'format:check': 'turbo format:check',
      test: 'turbo test',
      'type-check': 'turbo type-check',
      ...(enabledFeatures.includes('ui') && {
        storybook: 'turbo storybook',
        'build-storybook': 'turbo build-storybook',
      }),
      prepare: 'husky',
      release: 'semantic-release',
    },
    devDependencies: {
      turbo: '^2.0.0',
      '@commitlint/cli': '^19.4.0',
      '@commitlint/config-conventional': '^19.4.0',
      husky: '^9.1.6',
      'lint-staged': '^15.2.10',
      'semantic-release': '^24.2.7',
    },
    'lint-staged': {
      ...(enabledFeatures.includes('ui') && {
        'packages/ui/**/*.{js,jsx,ts,tsx,css,md,html,json}': [
          'cd packages/ui && pnpm prettier --write --',
          'cd packages/ui && pnpm eslint --max-warnings 0 --',
        ],
      }),
      ...(enabledFeatures.includes('api') && {
        'packages/api/**/*.py': [
          'cd packages/api && uv run ruff format -- --respect-gitignore',
          'cd packages/api && uv run ruff check --',
        ],
      }),
    },
    packageManager: `${config.packageManager}@${getPackageManagerVersion(config.packageManager)}`,
  };

  return JSON.stringify(packageJson, null, 2);
};
