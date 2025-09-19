import { ConfigTemplateParams } from './index.js';

export const generatePnpmWorkspace = (params: ConfigTemplateParams): string => {
  // Note: params is included for consistency with other template functions
  // but is not currently used for workspace configuration
  return `packages:
  - 'packages/*'
  - 'packages/configs/*'
`;
};
