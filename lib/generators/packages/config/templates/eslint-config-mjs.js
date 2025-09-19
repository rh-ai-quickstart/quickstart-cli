export function generateESLintConfigMJS(config) {
    return `import config from './index.cjs';

export default config;
`;
}
