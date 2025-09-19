import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { z } from 'zod';
import { Command } from './types.js';

// Add package arguments schema
const AddPackageArgsSchema = z.object({
  packageName: z.string(),
  targetProject: z.string().optional(),
});

export type AddPackageArgs = z.infer<typeof AddPackageArgsSchema>;

// Parse arguments specific to add-package command
function parseAddPackageArgs(args: string[]): AddPackageArgs {
  const parsed: any = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--project' || arg === '-p') {
      parsed.targetProject = args[++i];
    } else if (!arg.startsWith('-') && !parsed.packageName) {
      parsed.packageName = arg;
    }
  }

  return AddPackageArgsSchema.parse(parsed);
}

// Add package command component
function AddPackageCommand({ args }: { args: AddPackageArgs }) {
  const [showDemo, setShowDemo] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useInput((input: string) => {
    if (input === 'd' && !showDemo && !isComplete) {
      setShowDemo(true);
    }
  });

  if (showDemo && !isComplete) {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Text color="blue">⏳ Adding package "{args.packageName}"... (demo)</Text>
        <Text color="gray">This would show a progress indicator.</Text>
      </Box>
    );
  }

  if (isComplete) {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Text color="green" bold>
          ✅ Package Added Successfully!
        </Text>
        <Text color="gray">
          Package <Text color="cyan">{args.packageName}</Text> has been added to your project.
        </Text>
        <Text color="gray">(This is just a demo - feature coming soon!)</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Text color="yellow" bold>
        🚧 Coming Soon!
      </Text>
      <Text>The add-package command is not yet implemented.</Text>
      <Text color="gray">This will allow you to add new packages to existing projects.</Text>
      <Text>
        Would add package: <Text color="cyan">{args.packageName}</Text>
        {args.targetProject && (
          <Text>
            {' '}
            to project: <Text color="cyan">{args.targetProject}</Text>
          </Text>
        )}
      </Text>

      <Box marginTop={1}>
        <Text color="blue">
          💡 Press <Text color="yellow">d</Text> to see a demo of the progress indicator
        </Text>
      </Box>
    </Box>
  );
}

// Export the add-package command configuration
export const addPackageCommand: Command = {
  name: 'add-package',
  description: 'Add a new package to an existing project',
  usage: 'rh-ai-kickstart add-package <package-name> [options]',
  examples: [
    'rh-ai-kickstart add-package auth',
    'rh-ai-kickstart add-package payments --project my-app',
  ],
  component: AddPackageCommand,
  parseArgs: parseAddPackageArgs,
};
