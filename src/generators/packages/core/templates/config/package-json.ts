import { ConfigTemplateParams } from './index.js';
import { CORE_VERSIONS, getPackageManagerVersion } from '../../../../versions.js';
import {
  getScriptCommand,
  runWorkspaceScript,
  getSetupCommand,
} from '../../../../utils/package-manager.js';

export const generateRootPackageJson = (params: ConfigTemplateParams): string => {
  const { config } = params;

  const enabledFeatures = Object.entries(config.features)
    .filter(([_, enabled]) => enabled)
    .map(([featureId, _]) => featureId);

  const packageJson = {
    name: config.name,
    version: '0.1.0',
    description:
      config.description || `A full-stack application built with modern tools and best practices.`,
    private: true,
    workspaces: ['packages/*'],
    scripts: {
      postinstall: 'husky',
      setup: getSetupCommand(config.packageManager),
      build: 'turbo build',
      dev: 'turbo dev',
      ...(enabledFeatures.includes('db') && {
        'db:start': runWorkspaceScript(config.packageManager, `@${config.name}/db`, 'db:start', true),
        'db:stop': runWorkspaceScript(config.packageManager, `@${config.name}/db`, 'db:stop', true),
        'db:upgrade': runWorkspaceScript(config.packageManager, `@${config.name}/db`, 'upgrade', true),
        'db:revision': runWorkspaceScript(config.packageManager, `@${config.name}/db`, 'revision', true),
        'compose:up': 'podman-compose up -d',
        'compose:down': 'podman-compose down',
        'compose:logs': 'podman-compose logs -f',
        'containers:build': 'podman-compose build',
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
      ...CORE_VERSIONS,
    },
    'lint-staged': {
      ...(enabledFeatures.includes('ui') && {
        'packages/ui/**/*.{js,jsx,ts,tsx,css,md,html,json}': [
          `cd packages/ui && ${getScriptCommand(config.packageManager)} prettier --write --`,
          `cd packages/ui && ${getScriptCommand(config.packageManager)} eslint --max-warnings 0 --`,
        ],
      }),
      ...(enabledFeatures.includes('api') && {
        'packages/api/**/*.py': [
          'cd packages/api && uv run ruff format -- --respect-gitignore',
          'cd packages/api && uv run ruff check --',
        ],
      }),
    },
    ...(config.packageManager === 'pnpm' && {
      pnpm: {
        overrides: {
          'esbuild': '^0.27.0',
        },
      },
    }),
    packageManager: `${config.packageManager}@${getPackageManagerVersion(config.packageManager)}`,
  };

  return JSON.stringify(packageJson, null, 2);
};
