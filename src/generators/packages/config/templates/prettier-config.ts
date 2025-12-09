import { ProjectConfig } from '../../../../types/features.js';

export function generatePrettierConfig(config: ProjectConfig): string {
  return /* json */ `{
  "printWidth": 88,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "arrowParens": "always",
  "endOfLine": "lf"
}
`;
}
