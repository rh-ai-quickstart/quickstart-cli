import { PackageManager } from '../../types/features.js';
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
export declare function getScriptCommand(packageManager: PackageManager): string;
/**
 * Generate a command to run a script in a specific workspace/package.
 *
 * @param packageManager - The package manager to use
 * @param packageName - The package name (e.g., "@my-project/db")
 * @param script - The script name to run
 * @param usePattern - If true, use pattern matching (pnpm only: @*\/db), otherwise use exact package name
 * @returns The command string
 */
export declare function runWorkspaceScript(packageManager: PackageManager, packageName: string, script: string, usePattern?: boolean): string;
/**
 * Generate a command to run a script recursively across all workspaces.
 *
 * @param packageManager - The package manager to use
 * @param script - The script name to run
 * @param ifPresent - If true, only run if script exists (pnpm/npm only)
 * @returns The command string
 */
export declare function runRecursiveScript(packageManager: PackageManager, script: string, ifPresent?: boolean): string;
/**
 * Generate a setup command that installs dependencies and runs install:deps in all workspaces.
 *
 * @param packageManager - The package manager to use
 * @returns The command string
 */
export declare function getSetupCommand(packageManager: PackageManager): string;
