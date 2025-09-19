import { ProjectConfig } from '../../../../types/features.js';

export function generatePrettierConfig(config: ProjectConfig): string {
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
