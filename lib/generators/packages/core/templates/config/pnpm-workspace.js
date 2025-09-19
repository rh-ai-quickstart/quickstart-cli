export const generatePnpmWorkspace = (params) => {
    // Note: params is included for consistency with other template functions
    // but is not currently used for workspace configuration
    return `packages:
  - 'packages/*'
  - 'packages/configs/*'
`;
};
