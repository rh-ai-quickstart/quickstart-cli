import { CommandRegistry } from './types.js';
import { createCommand } from './create.js';
import { addPackageCommand } from './add-package.js';

export const commands: CommandRegistry = {
  create: createCommand,
  'add-package': addPackageCommand,
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
