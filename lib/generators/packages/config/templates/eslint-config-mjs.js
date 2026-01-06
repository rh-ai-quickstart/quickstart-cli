export function generateESLintConfigMJS(config) {
    return /* javascript */ `import config from './index.cjs';

export default config;
`;
}
