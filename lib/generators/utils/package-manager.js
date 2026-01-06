/**
 * Package Manager Command Utilities
 *
 * Provides helper functions to generate package manager commands
 * that work correctly across pnpm, yarn, and npm.
 */
/**
 * Get the command prefix for running scripts.
 * npm requires "npm run", while pnpm and yarn can run scripts directly.
 */
export function getScriptCommand(packageManager) {
    return packageManager === 'npm' ? 'npm run' : packageManager;
}
/**
 * Generate a command to run a script in a specific workspace/package.
 *
 * @param packageManager - The package manager to use
 * @param packageName - The package name (e.g., "@my-project/db")
 * @param script - The script name to run
 * @param usePattern - If true, use pattern matching (pnpm only: @*\/db), otherwise use exact package name
 * @returns The command string
 */
export function runWorkspaceScript(packageManager, packageName, script, usePattern = false) {
    if (packageManager === 'pnpm') {
        const filter = usePattern ? packageName.replace(/@[^/]+\//, '@*/') : packageName;
        return `pnpm --filter ${filter} ${script}`;
    }
    else if (packageManager === 'yarn') {
        return `yarn workspace ${packageName} ${script}`;
    }
    else {
        return `npm run --workspace=${packageName} ${script}`;
    }
}
/**
 * Generate a command to run a script recursively across all workspaces.
 *
 * @param packageManager - The package manager to use
 * @param script - The script name to run
 * @param ifPresent - If true, only run if script exists (pnpm/npm only)
 * @returns The command string
 */
export function runRecursiveScript(packageManager, script, ifPresent = false) {
    if (packageManager === 'pnpm') {
        const flags = ifPresent ? '-r --if-present' : '-r';
        return `pnpm ${flags} ${script}`;
    }
    else if (packageManager === 'yarn') {
        // Yarn doesn't support --if-present, so we use || true to ignore errors
        const suffix = ifPresent ? ' || true' : '';
        return `yarn workspaces run ${script}${suffix}`;
    }
    else {
        const flags = ifPresent ? '--workspaces --if-present' : '--workspaces';
        return `npm run ${flags} ${script}`;
    }
}
/**
 * Generate a setup command that installs dependencies and runs install:deps in all workspaces.
 *
 * @param packageManager - The package manager to use
 * @returns The command string
 */
export function getSetupCommand(packageManager) {
    const installCmd = `${packageManager} install`;
    const depsCmd = runRecursiveScript(packageManager, 'install:deps', true);
    return `${installCmd} && ${depsCmd}`;
}
