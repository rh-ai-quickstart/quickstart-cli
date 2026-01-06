import { createCommand } from './create.js';
export const commands = {
    create: createCommand,
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
