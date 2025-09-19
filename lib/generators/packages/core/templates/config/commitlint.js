export const generateCommitlintConfig = (_params) => {
    return `module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
  },
};
`;
};
