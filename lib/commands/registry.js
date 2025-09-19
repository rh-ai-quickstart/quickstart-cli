import { createCommand } from './create.js';
import { addPackageCommand } from './add-package.js';
export const commands = {
    create: createCommand,
    'add-package': addPackageCommand,
};
export const getCommand = (name) => {
    return commands[name];
};
export const getAllCommands = () => {
    return Object.values(commands);
};
export const getCommandNames = () => {
    return Object.keys(commands);
};
