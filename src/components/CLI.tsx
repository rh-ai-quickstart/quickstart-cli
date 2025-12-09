import React from 'react';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import { getCommand, getAllCommands } from '../commands/registry.js';

interface CLIArgs {
  command?: string;
  args: string[];
  showHelp?: boolean;
  showVersion?: boolean;
}

interface CLIProps {
  args: CLIArgs;
}

function GlobalHelp() {
  const commands = getAllCommands();

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box>
        <Text color="cyan" bold>
          AI QuickStart CLI
        </Text>
      </Box>

      <Text color="gray">Create and manage AI-powered full-stack applications</Text>

      <Box marginTop={1}>
        <Text color="green" bold>
          Usage:
        </Text>
      </Box>
      <Text> quickstart &lt;command&gt; [options]</Text>

      <Box marginTop={1}>
        <Text color="green" bold>
          Available Commands:
        </Text>
      </Box>
      {commands.map((cmd) => (
        <Box key={cmd.name} flexDirection="row" marginLeft={2}>
          <Box width={16}>
            <Text color="cyan">{cmd.name}</Text>
          </Box>
          <Text color="gray">{cmd.description}</Text>
        </Box>
      ))}

      <Box marginTop={1}>
        <Text color="green" bold>
          Global Options:
        </Text>
      </Box>
      <Box flexDirection="row" marginLeft={2}>
        <Box width={16}>
          <Text color="yellow">-h, --help</Text>
        </Box>
        <Text color="gray">Show help for command</Text>
      </Box>
      <Box flexDirection="row" marginLeft={2}>
        <Box width={16}>
          <Text color="yellow">-v, --version</Text>
        </Box>
        <Text color="gray">Show version number</Text>
      </Box>

      <Box marginTop={1}>
        <Text color="green" bold>
          Examples:
        </Text>
      </Box>
      <Text color="gray"> quickstart create my-app</Text>
      <Text color="gray"> quickstart create --help</Text>
      <Text color="gray"> quickstart create my-app --packages api,ui,db</Text>
      <Text color="gray"> quickstart create my-app -p api,ui -d "My project"</Text>

      <Box marginTop={1}>
        <Text color="gray">
          For more information, visit: https://github.com/TheiaSurette/quickstart-cli
        </Text>
      </Box>
    </Box>
  );
}

function CommandHelp({ command }: { command: string }) {
  const cmd = getCommand(command);

  if (!cmd) {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Text color="red">❌ Unknown command: {command}</Text>
        <Text>Run 'quickstart --help' to see available commands.</Text>
      </Box>
    );
  }

  // Define options for each command
  const commandOptions: Record<string, Array<{ flag: string; description: string }>> = {
    create: [
      {
        flag: '--skip-dependencies, -s',
        description: 'Skip installing dependencies after generation',
      },
      {
        flag: '--output-dir, -o <path>',
        description: 'Output directory for the project (default: current directory)',
      },
      {
        flag: '--packages, -p <packages>',
        description:
          'Comma-separated list of packages: api, ui, db (spaces after commas are allowed)',
      },
      { flag: '--description, -d <text>', description: 'Project description' },
    ],
  };

  const options = commandOptions[cmd.name] || [];

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Text color="cyan" bold>
        Command: {cmd.name}
      </Text>
      <Text color="gray">{cmd.description}</Text>

      <Box marginTop={1}>
        <Text color="green" bold>
          Usage:
        </Text>
      </Box>
      <Text> {cmd.usage}</Text>

      {options.length > 0 && (
        <>
          <Box marginTop={1}>
            <Text color="green" bold>
              Options:
            </Text>
          </Box>
          {options.map((option, index) => (
            <Box key={index} flexDirection="row" marginLeft={2}>
              <Box width={28}>
                <Text color="yellow">{option.flag}</Text>
              </Box>
              <Text color="gray">{option.description}</Text>
            </Box>
          ))}
        </>
      )}

      <Box marginTop={1}>
        <Text color="green" bold>
          Examples:
        </Text>
      </Box>
      {cmd.examples.map((example, index) => (
        <Text key={index} color="gray">
          {' '}
          {example}
        </Text>
      ))}
    </Box>
  );
}

export function CLI({ args }: CLIProps) {
  // Show version
  if (args.showVersion) {
    return (
      <Box paddingX={2} paddingY={1}>
        <Text>1.0.0</Text>
      </Box>
    );
  }

  // Show global help
  if (args.showHelp && !args.command) {
    return <GlobalHelp />;
  }

  // Show command help
  if (args.showHelp && args.command) {
    return <CommandHelp command={args.command} />;
  }

  // No command provided
  if (!args.command) {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Text color="red">❌ No command provided</Text>
        <Text>Run 'quickstart --help' to see available commands.</Text>
      </Box>
    );
  }

  // Execute command
  const command = getCommand(args.command);
  if (!command) {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Text color="red">❌ Unknown command: {args.command}</Text>
        <Text>Run 'quickstart --help' to see available commands.</Text>
      </Box>
    );
  }

  // Parse command-specific arguments and render component
  const CommandComponent = command.component;
  const commandArgs = command.parseArgs(args.args);

  return <CommandComponent args={commandArgs} />;
}
