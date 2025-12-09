import { ConfigTemplateParams } from './index.js';

export function generateESLintConfig(params: ConfigTemplateParams): string {
  const { config } = params;

  return /* javascript */ `import config from '@${config.name}/eslint-config';

export default [...config];
`;
}
