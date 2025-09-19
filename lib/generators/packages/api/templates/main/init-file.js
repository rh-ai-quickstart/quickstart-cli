export const generateInitFile = (params) => {
    const { config } = params;
    return `"""FastAPI application for ${config.name}"""

__version__ = "0.0.0"
`;
};
