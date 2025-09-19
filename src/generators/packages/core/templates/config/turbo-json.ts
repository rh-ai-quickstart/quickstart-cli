import { ConfigTemplateParams } from './index.js';

export const generateTurboJson = (params: ConfigTemplateParams): string => {
  const { config } = params;

  const turboConfig = {
    $schema: 'https://turbo.build/schema.json',
    tasks: {
      build: {
        dependsOn: ['^build'],
        outputs: ['dist/**', 'lib/**'],
      },
      dev: {
        cache: false,
        persistent: true,
      },
      lint: {},
      'lint:fix': {},
      format: {},
      'format:check': {},
      test: {},
      'type-check': {},
      ...(config.features.ui && {
        storybook: {
          cache: false,
          persistent: true,
        },
        'build-storybook': {
          dependsOn: ['^build'],
          outputs: ['storybook-static/**'],
        },
      }),
    },
  };

  return JSON.stringify(turboConfig, null, 2);
};
