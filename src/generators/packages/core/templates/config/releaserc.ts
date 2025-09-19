import { ConfigTemplateParams } from './index.js';

export const generateReleaseRc = (_params: ConfigTemplateParams): string => {
  const json = {
    branches: ['main', { name: 'next', prerelease: true }],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
      '@semantic-release/github',
    ],
  } as const;

  return JSON.stringify(json, null, 2) + '\n';
};
