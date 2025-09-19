import { ConfigTemplateParams } from './index.js';

export const generateCommitlintConfig = (_params: ConfigTemplateParams): string => {
  return `module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
  },
};
`;
};
