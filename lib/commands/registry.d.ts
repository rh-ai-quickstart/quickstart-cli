import { CommandRegistry } from './types.js';
export declare const commands: CommandRegistry;
export declare const getCommand: (name: string) => import("./types.js").Command;
export declare const getAllCommands: () => import("./types.js").Command[];
export declare const getCommandNames: () => string[];
