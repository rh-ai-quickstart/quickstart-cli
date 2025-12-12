export function generateESLintConfig(params) {
    const { config } = params;
    return /* javascript */ `import config from '@${config.name}/eslint-config';

export default [...config];
`;
}
