export const generateReleaseRc = (_params) => {
    const json = {
        branches: ['main', { name: 'next', prerelease: true }],
        plugins: [
            '@semantic-release/commit-analyzer',
            '@semantic-release/release-notes-generator',
            ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
            '@semantic-release/github',
        ],
    };
    return JSON.stringify(json, null, 2) + '\n';
};
