export function generatePrettierPackageJson(config) {
    const { name } = config;
    return `{
  "name": "@${name}/prettier-config",
  "version": "0.0.0",
  "private": true,
  "main": "index.json",
  "license": "MIT"
}
`;
}
