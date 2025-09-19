export const generateHuskyPreCommitHook = (_params) => {
    return `pnpm lint-staged
`;
};
export const generateHuskyCommitMsgHook = (_params) => {
    return `pnpm commitlint --edit $1
`;
};
