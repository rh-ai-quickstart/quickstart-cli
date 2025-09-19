export function generatePrettierRc(params) {
    const { config } = params;
    return `"@${config.name}/prettier-config"
`;
}
