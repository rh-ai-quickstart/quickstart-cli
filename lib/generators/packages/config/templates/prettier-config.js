export function generatePrettierConfig(config) {
    return `{
  "printWidth": 88,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "arrowParens": "always",
  "endOfLine": "lf"
}
`;
}
