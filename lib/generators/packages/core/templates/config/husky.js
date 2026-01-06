import { getScriptCommand } from '../../../../utils/package-manager.js';
export const generateHuskyPreCommitHook = (params) => {
    const scriptCmd = getScriptCommand(params.config.packageManager);
    return `${scriptCmd} lint-staged
`;
};
export const generateHuskyCommitMsgHook = (params) => {
    const scriptCmd = getScriptCommand(params.config.packageManager);
    return `${scriptCmd} commitlint --edit $1
`;
};
