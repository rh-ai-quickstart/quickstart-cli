import { CommandRegistry } from './types.js';
import { createCommand } from './create.js';

export const commands: CommandRegistry = {
  create: createCommand,
};

export const getCommand = (name: string) => {
  return commands[name];
};

export const getAllCommands = () => {
  return Object.values(commands);
};

export const getCommandNames = () => {
  return Object.keys(commands);
};
