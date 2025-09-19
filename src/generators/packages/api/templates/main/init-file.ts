import { SourceTemplateParams } from '.';

export const generateInitFile = (params: SourceTemplateParams): string => {
  const { config } = params;
  return `"""FastAPI application for ${config.name}"""

__version__ = "0.0.0"
`;
};