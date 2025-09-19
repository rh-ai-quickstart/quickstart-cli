import React from 'react';

export interface BaseCommandArgs {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

export interface Command {
  name: string;
  description: string;
  usage: string;
  examples: string[];
  component: React.ComponentType<any>;
  parseArgs: (args: string[]) => any;
}

export interface CommandRegistry {
  [key: string]: Command;
}
