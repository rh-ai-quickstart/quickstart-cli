export function generateESLintConfig(params) {
    const { config } = params;
    return `import config from '@${config.name}/eslint-config';

export default [...config];
`;
}
