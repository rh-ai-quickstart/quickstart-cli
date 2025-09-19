import { ConfigTemplateParams } from './index.js';

export function generatePrettierRc(params: ConfigTemplateParams): string {
  const { config } = params;
  
  return `"@${config.name}/prettier-config"
`;
}
