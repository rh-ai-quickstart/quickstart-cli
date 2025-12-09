import React from 'react';
import { Box, Text, useInput } from 'ink';

interface ErrorMessageProps {
  error: string;
  onRestart: () => void;
  onExit: () => void;
}

export function ErrorMessage({ error, onRestart, onExit }: ErrorMessageProps) {
  useInput((input) => {
    if (input === 'r') {
      onRestart();
    } else if (input === 'q' || input === 'e') {
      onExit();
    }
  });

  const getSuggestions = (error: string): string[] => {
    const suggestions: string[] = [];

    if (error.includes('EACCES') || error.includes('permission')) {
      suggestions.push('• Try running with different permissions');
      suggestions.push('• Choose a different output directory');
      suggestions.push('• Check if the directory is in use by another process');
    }

    if (error.includes('ENOENT') || error.includes('not found')) {
      suggestions.push('• Check that all required tools are installed');
      suggestions.push('• Verify the template directory exists');
      suggestions.push('• Make sure pnpm/npm is available in your PATH');
    }

    if (error.includes('already exists')) {
      suggestions.push('• Choose a different project name');
      suggestions.push('• Remove the existing directory');
      suggestions.push('• Use a different output directory');
    }

    if (error.includes('network') || error.includes('timeout')) {
      suggestions.push('• Check your internet connection');
      suggestions.push('• Try again in a few moments');
      suggestions.push('• Consider using a different registry');
    }

    if (error.includes('invalid') || error.includes('validation')) {
      suggestions.push('• Check your project name format');
      suggestions.push('• Ensure all required fields are filled');
      suggestions.push('• Try with different configuration options');
    }

    if (suggestions.length === 0) {
      suggestions.push('• Try restarting the CLI');
      suggestions.push('• Check the GitHub issues for similar problems');
      suggestions.push('• Run with verbose logging for more details');
    }

    return suggestions;
  };

  const suggestions = getSuggestions(error);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box flexDirection="column" borderStyle="round" borderColor="red" padding={2} marginY={1}>
        <Text color="red" bold>
          ❌ Oops! Something went wrong
        </Text>
        <Text color="gray">We encountered an error while creating your project.</Text>

        <Box marginY={1} borderStyle="single" borderColor="red" padding={1} flexDirection="column">
          <Text color="red" bold>
            Error Details:
          </Text>
          <Text color="white">{error}</Text>
        </Box>

        <Box flexDirection="column" marginTop={1}>
          <Text color="yellow" bold>
            💡 Suggested Solutions:
          </Text>
          {suggestions.map((suggestion, index) => (
            <Text key={index} color="gray">
              {suggestion}
            </Text>
          ))}
        </Box>

        <Box
          marginTop={1}
          borderStyle="single"
          borderColor="blue"
          padding={1}
          flexDirection="column"
        >
          <Text color="blue" bold>
            🔧 Troubleshooting Resources:
          </Text>
          <Text>• Documentation: https://github.com/TheiaSurette/quickstart-cli</Text>
          <Text>• Issues: https://github.com/TheiaSurette/quickstart-cli/issues</Text>
          <Text>• Discord: https://discord.gg/your-server</Text>
        </Box>

        <Box marginTop={1} flexDirection="row" justifyContent="space-between">
          <Text>
            Press{' '}
            <Text color="green" bold>
              r
            </Text>{' '}
            to restart • Press{' '}
            <Text color="red" bold>
              q
            </Text>{' '}
            to quit
          </Text>
        </Box>
      </Box>

      <Text color="gray">
        If the problem persists, please report it with the error details above.
      </Text>
    </Box>
  );
}
