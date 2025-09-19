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
      <Gradient name="rainbow">
        <BigText text="AI Kickstart" font="block" />
      </Gradient>

      <Text color="gray">Create and manage AI-powered full-stack applications</Text>

      <Box marginTop={1}>
        <Text color="green" bold>
          Usage:
        </Text>
      </Box>
      <Text> rh-ai-kickstart &lt;command&gt; [options]</Text>

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
      <Text color="gray"> rh-ai-kickstart create my-app</Text>
      <Text color="gray"> rh-ai-kickstart add-package auth</Text>
      <Text color="gray"> rh-ai-kickstart remove-package old-feature</Text>
      <Text color="gray"> rh-ai-kickstart create --help</Text>

      <Box marginTop={1}>
        <Text color="gray">
          For more information, visit: https://github.com/your-org/ai-kickstart
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
        <Text>Run 'rh-ai-kickstart --help' to see available commands.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Text color="green" bold>
        Command: {cmd.name}
      </Text>
      <Text color="gray">{cmd.description}</Text>

      <Box marginTop={1}>
        <Text color="green" bold>
          Usage:
        </Text>
      </Box>
      <Text> {cmd.usage}</Text>

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
        <Text>Run 'rh-ai-kickstart --help' to see available commands.</Text>
      </Box>
    );
  }

  // Execute command
  const command = getCommand(args.command);
  if (!command) {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Text color="red">❌ Unknown command: {args.command}</Text>
        <Text>Run 'rh-ai-kickstart --help' to see available commands.</Text>
      </Box>
    );
  }

  // Parse command-specific arguments and render component
  const CommandComponent = command.component;
  const commandArgs = command.parseArgs(args.args);

  return <CommandComponent args={commandArgs} />;
}
