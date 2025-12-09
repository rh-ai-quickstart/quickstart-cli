#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import { CLI } from './components/CLI.js';
import { getCommandNames } from './commands/registry.js';

interface ParsedArgs {
  command?: string;
  args: string[];
  showHelp?: boolean;
  showVersion?: boolean;
}

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2);
  const commandNames = getCommandNames();

  if (args.length === 0) {
    return { args: [], showHelp: true };
  }

  // Check for global flags first
  if (args.includes('--help') || args.includes('-h')) {
    // If help is requested for a specific command
    const commandIndex = args.findIndex((arg) => commandNames.includes(arg));
    if (commandIndex !== -1) {
      return {
        command: args[commandIndex],
        args: [],
        showHelp: true,
      };
    }
    // Global help
    return { args: [], showHelp: true };
  }

  if (args.includes('--version') || args.includes('-v')) {
    return { args: [], showVersion: true };
  }

  // Find the command
  const command = args[0];
  if (commandNames.includes(command)) {
    return {
      command,
      args: args.slice(1),
    };
  }

  // If no valid command, assume 'create' for backward compatibility
  return {
    command: 'create',
    args: args,
  };
}

async function main() {
  try {
    const args = parseArgs();

    const { waitUntilExit } = render(<CLI args={args} />);

    await waitUntilExit();
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Goodbye!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
