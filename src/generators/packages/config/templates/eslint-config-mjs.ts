import { ProjectConfig } from '../../../../types/features.js';

export function generateESLintConfigMJS(config: ProjectConfig): string {
  return /* javascript */ `import config from './index.cjs';

export default config;
`;
}
