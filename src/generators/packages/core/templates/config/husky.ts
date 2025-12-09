import { ConfigTemplateParams } from './index.js';
import { getScriptCommand } from '../../../../utils/package-manager.js';

export const generateHuskyPreCommitHook = (params: ConfigTemplateParams): string => {
  const scriptCmd = getScriptCommand(params.config.packageManager);
  return `${scriptCmd} lint-staged
`;
};

export const generateHuskyCommitMsgHook = (params: ConfigTemplateParams): string => {
  const scriptCmd = getScriptCommand(params.config.packageManager);
  return `${scriptCmd} commitlint --edit $1
`;
};
