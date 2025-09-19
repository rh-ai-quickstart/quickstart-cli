import { ProjectConfig } from '../../../../types/features.js';

export function generateESLintConfigMJS(config: ProjectConfig): string {
  return `import config from './index.cjs';

export default config;
`;
}
