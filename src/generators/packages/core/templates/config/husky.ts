import { ConfigTemplateParams } from './index.js';

export const generateHuskyPreCommitHook = (_params: ConfigTemplateParams): string => {
  return `pnpm lint-staged
`;
};

export const generateHuskyCommitMsgHook = (_params: ConfigTemplateParams): string => {
  return `pnpm commitlint --edit $1
`;
};
